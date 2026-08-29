package com.geekychads.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Primary;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Repository;

import com.geekychads.model.Role;
import com.geekychads.model.User;

/*
 * The step 7 implementation: the same five-plus-four operations, against Atlas instead of a
 * map. Nothing above this file changes - that claim is what the whole layering was for, and
 * `git diff` on UserService and UserController is what settles it.
 *
 * @Primary is the entire swap. Both this and InMemoryUserRepository implement UserRepository,
 * so Spring would otherwise refuse to start with two candidates for one injection point.
 * @Primary picks the winner. The in-memory version stays compilable and injectable by type,
 * which is what a test would want; which one runs is now a configuration decision rather
 * than a code change, exactly as the comment on that class claimed it would be.
 */
@Repository
@Primary
public class MongoUserRepository implements UserRepository
{
    private final UserMongoRepository mongo;

    public MongoUserRepository(UserMongoRepository mongo)
    {
        this.mongo = mongo;
        seedIfEmpty();
    }

    // only write seed users when the collection is empty, so deleted records stay deleted
    // across restarts. the in-memory version's `if (users.isEmpty())` guard was redundant
    // against a fresh map; here it is load-bearing, because the data outlives the process.
    private void seedIfEmpty()
    {
        if (mongo.count() == 0)
        {
            mongo.save(new User(1, "mike", "mikewasowsky@gmail.com", "somehash", Role.Trainee));
            mongo.save(new User(2, "admin", "admin@gmail.com", "somehash", Role.TrainingManager));
            mongo.save(new User(3, "user2", "rando@gmail.com", "somehash", Role.Trainee));

            mongo.findById(1).ifPresent(u -> { u.updateProgress(2, 3); mongo.save(u); });
            mongo.findById(2).ifPresent(u -> { u.updateProgress(3, 3); mongo.save(u); });
            mongo.findById(3).ifPresent(u -> { u.updateProgress(1, 3); mongo.save(u); });
        }
    }

    @Override
    public List<User> getUsers()
    {
        // findAll already builds a fresh list, so the defensive copy the map version needed
        // is not needed here
        return mongo.findAll();
    }

    @Override
    public Optional<User> findById(int id)
    {
        return mongo.findById(id);
    }

    @Override
    public Optional<User> addUser(User user)
    {
        try
        {
            // insert, NOT save. save() upserts - it would silently overwrite an existing user
            // and report success, turning a create into an edit. insert() fails on a
            // duplicate _id, which is the answer this method is supposed to give.
            return Optional.of(mongo.insert(user));
        }
        catch (DuplicateKeyException e)
        {
            return Optional.empty();
        }
    }

    @Override
    public boolean deleteById(int id)
    {
        // deleteById returns void, so existence has to be checked first to know whether
        // anything was removed. the map's remove() returned the old value and answered both
        // questions at once - a small example of the interface hiding a real difference.
        if (!mongo.existsById(id))
        {
            return false;
        }

        mongo.deleteById(id);
        return true;
    }

    @Override
    public boolean changePassword(int id, String newPasswordHash)
    {
        return mongo.findById(id)
                .map(user ->
                {
                    user.setPasswordHash(newPasswordHash);
                    mongo.save(user);
                    return true;
                })
                .orElse(false);
    }

    @Override
    public boolean existsByUsername(String username)
    {
        return mongo.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email)
    {
        return mongo.existsByEmail(email);
    }

    @Override
    public Optional<User> findByUsername(String username)
    {
        return mongo.findByUsername(username);
    }

    @Override
    public List<User> findByRole(Role role)
    {
        return mongo.findByRole(role);
    }

    @Override
    public Optional<User> editUser(int id, User data)
    {
        return mongo.findById(id)
                .map(existing ->
                {
                    // only the fields an edit may change. completedModules, totalModules and
                    // passwordHash are preserved by NOT being touched - building a fresh User
                    // from `data` would compile, save cleanly, and silently zero every
                    // trainee's progress. that is the in-memory addUser bug in a new costume,
                    // and the shape of this method is what invites it back.
                    existing.setUsername(data.getUsername());
                    existing.setEmail(data.getEmail());
                    existing.setRole(data.getRole());

                    // explicit save, unlike the map version. that one mutated the object
                    // already held in storage, so the write had happened by the time the
                    // setter returned. this object is detached - mutating it changes nothing
                    // in Atlas until it is sent back.
                    return mongo.save(existing);
                });
        // empty Optional passes straight through: no user with that id, which the controller
        // reads as 404. the id is never taken from `data`, so the path stays the identity.
    }
}
