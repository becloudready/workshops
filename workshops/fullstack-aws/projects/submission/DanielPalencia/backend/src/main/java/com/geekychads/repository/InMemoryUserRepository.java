package com.geekychads.repository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.geekychads.model.Role;
import com.geekychads.model.User;

/*
 * The step 2 implementation: users live in a map and disappear when the process does.
 *
 * @Repository marks it as a bean so component scan finds it and can inject it into
 * UserService. At step 7 a second class implements the same interface, and which one is
 * wired becomes a configuration decision rather than a code change.
 *
 * LinkedHashMap rather than HashMap: it preserves insertion order, so GET /api/users returns
 * a stable, predictable sequence. HashMap ordering looks arbitrary and shifts between runs,
 * which makes every manual test harder to read and every "the first user" assertion a lie
 * waiting to happen.
 *
 * Known simplification: a Spring bean is a singleton serving concurrent requests, and a
 * LinkedHashMap is not thread-safe. Accepted because this class exists to be deleted - step 7
 * hands the concurrency problem to MongoDB, which is built for it. Worth knowing it is a
 * simplification rather than assuming the pattern was sound.
 */
@Repository
public class InMemoryUserRepository implements UserRepository
{
    private final Map<Integer, User> users = new LinkedHashMap<>();

    public InMemoryUserRepository()
    {
        seed();
    }

    @Override
    public List<User> getUsers()
    {
        // a copy, not the live collection. handing out users.values() would let a caller
        // clear the repository through a getter, and the service would look innocent.
        return new ArrayList<>(users.values());
    }

    @Override
    public Optional<User> findById(int id)
    {
        // ofNullable turns "the map had no such key" into an empty Optional rather than a
        // null that travels upward until something dereferences it
        return Optional.ofNullable(users.get(id));
    }

    @Override
    public Optional<User> addUser(User user)
    {
        // containsKey rather than findById(...).isPresent(): same answer, one less object.
        if (users.containsKey(user.getId()))
        {
            return Optional.empty();
        }

        // stored as given. your version rebuilt the user through the constructor, which is a
        // sound defensive-copy instinct - but the copy dropped completedModules and
        // totalModules, so saving a user with progress silently zeroed it. A copy has to be
        // complete or it is worse than no copy: it loses data quietly instead of sharing a
        // reference obviously.
        users.put(user.getId(), user);
        return Optional.of(user);
    }

    @Override
    public boolean deleteById(int id)
    {
        // remove returns the previous value, or null if the key was absent - which is exactly
        // the boolean the interface promises, in one operation.
        //
        // your version looked it up and then removed it. Two operations where one will do,
        // and the answer can change between them under concurrency. The reasoning in your
        // comment - staying map-agnostic for the Mongo swap - belongs one level up: the
        // ABSTRACTION is the interface, and step 7 deletes this whole class. Inside here,
        // being map-specific is the point.
        return users.remove(id) != null;
    }

    @Override
    public Optional<User> editUser(int id, User data)
    {
        if (!users.containsKey(id))
        {
            return Optional.empty(); //no such user
        }

        // passwordHash is deliberately NOT copied across - a password change is its own
        // operation, changePassword below. see the reasoning on the interface. without this
        // note the omission reads as a field somebody forgot.
        User existingUser = users.get(id);
        existingUser.setUsername(data.getUsername());
        existingUser.setEmail(data.getEmail());
        existingUser.setRole(data.getRole());

        //users.put(id, existingUser); already updated reference in map
        return Optional.of(existingUser);
    }
    @Override
    public boolean changePassword(int id, String newPasswordHash)
    {
        if (!users.containsKey(id))
        {
            return false; // no such user
        }

        User existingUser = users.get(id);
        existingUser.setPasswordHash(newPasswordHash);
        return true;
    }

    @Override
    public boolean existsByUsername(String username)
    {
        // a linear scan, which is honest about what a map keyed by id can do. mongo replaces
        // this with an indexed lookup at step 7 - that difference is exactly why the question
        // is asked here rather than answered in the service.
        return users.values().stream().anyMatch(u -> username.equals(u.getUsername()));
    }

    @Override
    public boolean existsByEmail(String email)
    {
        return users.values().stream().anyMatch(u -> email.equals(u.getEmail()));
    }

    // note: both compare case-SENSITIVELY, so "Mike" and "mike" are two different users.
    // that is a real decision, not an accident of String.equals - most systems treat
    // usernames and emails as case-insensitive precisely because users do. left as-is
    // deliberately; change it when the team decides, and change it in both places.

    @Override
    public Optional<User> findByUsername(String username)
    {
        return users.values().stream()
                .filter(u -> username.equals(u.getUsername()))
                .findFirst();
    }

    @Override
    public List<User> findByRole(Role role)
    {
        return users.values().stream()
                .filter(u -> u.getRole() == role)
                .toList();
    }

    private void seed()
    {
        // guard kept from your version. it is redundant in a fresh map today, but it is the
        // same shape Banking_App uses against a real database, where the collection may
        // already hold data from a previous run - seeding on top of that would duplicate.
        if (users.isEmpty())
        {
            // ids assigned by hand, exactly as Banking_App seeds 1, 2, 3. at least one of
            // each Role, because a manager dashboard filtered to Trainee is worthless to
            // test if every seed user is a trainee.
            addUser(new User(1, "mike", "mikewasowsky@gmail.com", "somehash", Role.Trainee));
            addUser(new User(2, "admin", "admin@gmail.com", "somehash", Role.TrainingManager));
            addUser(new User(3, "user2", "rando@gmail.com", "somehash", Role.Trainee));

            // TODO 2 - vary the progress.
            //   Every seed user is currently 0 of 0, which renders as an empty bar and, worse,
            //   makes isTrainingCompleted() false for all three - so you cannot tell a working
            //   ?status=complete filter from a broken one. Call updateProgress on a couple of
            //   them through findById, and give one of them everything completed.
            findById(1).ifPresent(user -> user.updateProgress(2, 3));
            findById(2).ifPresent(user -> user.updateProgress(3, 3));
            findById(3).ifPresent(user -> user.updateProgress(1, 3));
            //doing it by hand and using find instead of allocatiing new User objects because theyre not that many
        }
    }
}
