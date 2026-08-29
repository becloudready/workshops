package com.geekychads.repository;

import java.util.List;
import java.util.Optional;

import com.geekychads.model.Role;
import com.geekychads.model.User;

/*
 * Storage for users, described in this application's vocabulary rather than any database's.
 *
 * An interface and not a class, because of step 7: when MongoDB replaces the in-memory list,
 * UserService must not change - and it cannot change if it never named a concrete class.
 * The service depends on UserRepository; which implementation it receives is decided by
 * Spring at startup rather than by the service's code.
 *
 * The five methods mirror the Banking_App repository deliberately, so the shape is one
 * already proven to survive the swap there: storage moved from an in-memory map to Atlas and
 * the service and controller above it did not change by a line.
 *
 * Deliberately NOT extending Spring Data's MongoRepository. Shorter, but it drags Spring
 * Data's vocabulary up into the service and puts two dozen other methods - deleteAll() among
 * them - within reach of business logic. Owning the interface means owning exactly which
 * operations exist.
 */
public interface UserRepository
{
    List<User> getUsers();

    // Optional, not a nullable User. "no user with that id" is a normal outcome - a bad id,
    // a stale link - not a failure. Returning null makes every caller remember to check;
    // Optional makes the compiler remind them. The repository reports absence as a fact and
    // says nothing about what it means: deciding that it is a 404 is the controller's job.
    //
    // int rather than Integer: it autoboxes, and a lookup always has a concrete id.
    Optional<User> findById(int id);

    // CREATE only. Empty means the id is already taken - which the controller turns into 409
    // rather than 400, because the failure is state-dependent: the same request would have
    // succeeded before that id existed and will succeed again once it is deleted.
    Optional<User> addUser(User user);

    // REPLACE only. Empty means no user has that id - a 404, because PUT does not create.
    //
    // Two parameters, and the split matters: `id` comes from the URL path and `data` from the
    // request body. The path id is the identity and wins; the body is only a source of field
    // values. That is what keeps a body whose id disagrees with the path from silently
    // overwriting the wrong record.
    Optional<User> editUser(int id, User data);

    // boolean, not void: the controller has to tell 204 from 404, and only storage knows
    // whether there was anything there to delete. Same discipline as the model - report the
    // fact, let the layer above choose the status code.
    boolean deleteById(int id);

    /*
     * Changing a password is its own operation, not a side effect of editing a profile.
     *
     * DECIDED: editUser deliberately does not touch passwordHash. Two reasons, and the second
     * is the one that settles it:
     *
     *   A password change is a different operation with different rules. It normally requires
     *   proving you know the CURRENT password - a check that has no place in "correct a typo
     *   in an email address", and that a profile edit has no reason to perform.
     *
     *   Rolling it into PUT means every profile edit carries a credential in its body. That
     *   is one more request that must never be logged, never cached, never retried blindly -
     *   for the sake of a field almost no edit intends to change.
     *
     * boolean, not Optional<User>: a password change has nothing useful to return, and
     * handing back the User invites a caller to serialise it into a response body. The answer
     * the controller needs is only "was there a user with that id" - 404 or no content.
     *
     * The parameter is named newPasswordHash, not newPassword, because that is what this
     * layer stores. WHERE the hashing happens is still open (AGENTS.md section 8) and this
     * signature deliberately does not decide it - it only refuses to pretend a hash is a
     * password.
     */
    boolean changePassword(int id, String newPasswordHash);

    /*
     * Uniqueness questions, asked by UserService before it allows a create or an edit.
     *
     * They live here rather than being answered in the service with a scan over getUsers()
     * for one reason that only shows up at step 7: MongoDB can answer these from an index in
     * constant time. A service that scanned every user would work identically today and
     * throw away that advantage permanently, because the repository would never be asked.
     *
     * Note what they DON'T do: they report a fact and take no view on what it means. The
     * service decides that a taken username is a refusal; the controller decides that the
     * refusal is a 409.
     */
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    /*
     * Step 6 filtering. Both live here rather than being done with a stream in the service,
     * for the same reason existsByUsername does: MongoDB answers them from an index, and a
     * service that filtered getUsers() in memory would work identically today while making
     * that impossible to ever use.
     *
     * findByUsername returns Optional, not List, and that is not a guess - it is the
     * uniqueness rule from step 3 showing up as a type. Because the service refuses to store
     * two users with one username, a lookup by username can only ever produce zero or one.
     * A List return would invite callers to handle a case the system does not allow.
     */
    Optional<User> findByUsername(String username);

    List<User> findByRole(Role role);
}
