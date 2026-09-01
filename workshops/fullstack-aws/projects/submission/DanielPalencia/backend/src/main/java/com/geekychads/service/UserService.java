package com.geekychads.service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.geekychads.model.Role;
import com.geekychads.model.User;
import com.geekychads.repository.UserRepository;

/*
 * Business rules for users. The layer that decides what is ALLOWED, sitting between a
 * controller that only speaks HTTP and a repository that only speaks storage.
 *
 * Most of what follows is a pass-through, and that looks like a wasted layer right up until
 * the first real rule lands - uniqueness, below. Three things it is already buying:
 *
 *   The controller can no longer reach the repository. Without this class in the way, the
 *   quickest route to any new feature is a controller calling storage directly, and the
 *   rules end up scattered across HTTP handlers where nothing but a web request can reuse
 *   them.
 *
 *   It is the only place a rule can live. Uniqueness cannot go in the repository - that is
 *   keyed by id and has no opinion about names. It must not go in the controller - a rule
 *   there is unreachable from a CLI, a scheduled job, or a message consumer.
 *
 *   It is where step 7 proves itself. When MongoDB replaces the map, this file must not
 *   change by a line. If it does, the seam leaked.
 *
 * CONSTRUCTOR INJECTION, not a field with @Autowired. The dependency is visible in the
 * signature, the field is final so it cannot be reassigned, and the class can be built in a
 * test with a mock repository and no Spring at all - which is exactly what step 8 needs.
 * Spring injects a single constructor automatically; no annotation is required.
 *
 * The parameter type is UserRepository, the INTERFACE. That is the whole dependency
 * inversion payoff: this class names a contract, never an implementation, so it cannot tell
 * whether it is talking to a LinkedHashMap or Atlas.
 */
@Service
public class UserService
{
    private final UserRepository repository;

    public UserService(UserRepository repository)
    {
        this.repository = repository;
    }

    public List<User> getUsers()
    {
        return repository.getUsers();
    }

    /*
     * Step 6 filtering. DECIDED: one filter at a time.
     *
     * Both parameters optional, at most one supplied. Asking for ?role=Trainee&username=admin
     * is a contradiction the caller almost certainly did not mean - "admin" is a
     * TrainingManager - and the alternatives were worse: applying both silently returns an
     * empty list that looks like missing data, and letting one win silently ignores half of
     * what was asked, which gets reported later as "the dashboard shows the wrong people".
     *
     * The guard throws rather than returning something. There is no room in a List to signal
     * a refusal, and unlike a taken username this is not a state-dependent outcome a caller
     * could reasonably hit - it is an incoherent call, which is what IllegalArgumentException
     * is for. Same reasoning as updateProgress rejecting 5-of-3.
     *
     * That makes the controller's matching check load-bearing rather than decorative: an
     * IllegalArgumentException escaping a handler is a 500, so the controller has to catch
     * the case first and answer 400. This guard exists for the callers that never come
     * through HTTP.
     */
    public List<User> getUsers(Role role, String username)
    {
        if (role != null && username != null)
        {
            throw new IllegalArgumentException("only one filter may be applied at a time");
        }

        if (username != null)
        {
            // Optional to a zero-or-one list. the shape comes straight from step 3's
            // uniqueness rule - there cannot be a second match to return.
            return repository.findByUsername(username)
                    .map(List::of)
                    .orElseGet(List::of);
        }

        if (role != null)
        {
            return repository.findByRole(role);
        }

        return repository.getUsers();
    }

    public Optional<User> findById(int id)
    {
        return repository.findById(id);
    }

    public boolean deleteById(int id)
    {
        return repository.deleteById(id);
    }

    // pass-through today. when the team settles whether a password change must prove the
    // CURRENT password, that check lands here - it is a rule, not storage and not HTTP.
    public boolean changePassword(int id, String newPasswordHash)
    {
        return repository.changePassword(id, newPasswordHash);
    }

    public Optional<User> addUser(User user)
    {
        if (repository.existsByUsername(user.getUsername()) || repository.existsByEmail(user.getEmail()))
        {
            return Optional.empty();
        }

        return repository.addUser(user);
    }

    /*
     * Full replacement, with the same uniqueness rule plus a wrinkle that only appears here.
     *
     * THE EXCLUDE-SELF TRAP. Editing user 1 while leaving the username "mike" makes
     * existsByUsername("mike") return true - user 1 is still stored under that name. A naive
     * check rejects every edit that does not rename, including fixing a typo in the email and
     * saving the form otherwise untouched.
     *
     * The rule is not "is this username taken" but "is this username taken BY SOMEONE ELSE".
     * No new repository method is needed: if the value is unchanged the only holder is this
     * user; if it has changed, any holder is by definition somebody else.
     *
     * WHAT EMPTY MEANS - three things, which step 5 untangles: the body id disagrees with the
     * path id, no user has that id, or the new username or email belongs to someone else. The
     * controller calls findById first to answer 404, leaving empty here meaning 409. Recorded
     * rather than solved: a result type carrying the reason is machinery this step does not
     * need, and the terse-error stance means the client would not be told which anyway.
     */
    public Optional<User> editUser(int id, User data)
    {
        // Objects.equals, not !=, so a null body id is a mismatch rather than an NPE. Either
        // half could be the typo, so a mismatch is refused rather than resolved by guessing -
        // guessing wrong edits a record the caller did not name.
        if (!Objects.equals(data.getId(), id))
        {
            return Optional.empty();
        }

        // hoisted. both checks below want this, and previously each looked it up again -
        // three round trips to storage for one question about one user.
        Optional<User> stored = repository.findById(id);

        if (stored.isEmpty())
        {
            return Optional.empty();
        }

        User existing = stored.get();

        // existence first, self-comparison second - your ordering, and it is the better one:
        // when nobody holds the name there is nothing to exclude, so the second half never
        // runs. it also removes the orElse("") sentinel, which only worked because @NotBlank
        // guarantees no real username is empty - a rule enforced in a different layer.
        if (repository.existsByUsername(data.getUsername())
                && !existing.getUsername().equals(data.getUsername()))
        {
            return Optional.empty();
        }

        if (repository.existsByEmail(data.getEmail())
                && !existing.getEmail().equals(data.getEmail()))
        {
            return Optional.empty();
        }

        return repository.editUser(id, data);
    }
}
