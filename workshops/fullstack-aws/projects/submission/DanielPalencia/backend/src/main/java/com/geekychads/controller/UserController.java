package com.geekychads.controller;

import java.net.URI;
import java.util.List;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.geekychads.model.Role;
import com.geekychads.model.User;
import com.geekychads.service.UserService;

import jakarta.validation.Valid;

/*
 * Translates HTTP to Java and back. No business rules live here.
 *
 * That is not a slogan, it is a test you can apply to every line below: if a statement in
 * this class decides what is ALLOWED rather than what to SAY, it is in the wrong file. The
 * service already answered every question this layer faces; all that is left is choosing
 * the status code that carries the answer.
 *
 * @RestController is @Controller plus @ResponseBody: return values are serialised into the
 * response body rather than resolved as view names. Without it, returning a List<User> would
 * have Spring hunting for a template called after the object.
 *
 * @RequestMapping puts the base path in one place. Every handler below is relative to it, so
 * the versioning or prefix decision - /api/users, settled in AGENTS.md section 7 - is changed
 * here and nowhere else.
 *
 * Constructor injection again, and for the same reasons: the dependency is visible in the
 * signature, the field is final, and the class can be built in a test with a mock service and
 * no Spring context at all.
 *
 * NOTE the type it depends on: UserService, never UserRepository. A controller that reaches
 * past the service can skip a rule without anything noticing - which is exactly how a
 * uniqueness check ends up enforced on three endpoints and forgotten on the fourth.
 */
@RestController
@RequestMapping("/api/users")
public class UserController
{
    private final UserService userService;

    public UserController(UserService userService)
    {
        this.userService = userService;
    }

    /*
     * GET /api/users
     *
     * This returned a bare List<User> until step 6, on the grounds that its status never
     * varied. Refusing combined filters made that false, and the return type had to change
     * with it - which is worth noticing rather than glossing: a return type is a claim about
     * how many outcomes a method has, and adding an outcome invalidates it. An empty result
     * is still 200 with [], though. The collection exists; the query just selected none of
     * it, and that is not a 404.
     *
     * STEP 6 - the filters. required = false makes both optional, so /api/users still means
     * "everyone" and the same handler serves the unfiltered case rather than needing a second
     * route for it. A filtered list that matches nothing is still 200 with [], not 404: the
     * collection exists and the query simply selected none of it.
     *
     * Note what does NOT appear here: any parsing. Spring binds ?role=Trainee straight to the
     * Role enum by exact constant name, and that only works because the constants were named
     * after the wire values back in step 1 rather than as TRAINING_MANAGER with a mapping
     * annotation. ?role=TRAINEE is a 400 before this method runs - the API's vocabulary is
     * enforced by the type system instead of by a validation branch somebody has to remember.
     */
    @GetMapping
    public ResponseEntity<List<User>> getUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) String username)
    {
        // combining filters is refused, so this handler's status now varies and the plain
        // List<User> return no longer covers it. checking here rather than letting the
        // service's guard surface is what makes it a 400 instead of a 500.
        if (role != null && username != null)
        {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(userService.getUsers(role, username));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id)
    {
        return userService.findById(id)
                .map(user -> ResponseEntity.ok(user)) //200
                .orElseGet(() -> ResponseEntity.notFound().build()); //404
    }

    /*
     * POST /api/users
     *
     * @Valid is doing more work than it looks. It runs the Bean Validation constraints on
     * User - @NotNull and @Positive on the id, @NotBlank on username, email and passwordHash,
     * @Email on the address - BEFORE this method is entered. A body that fails any of them
     * never reaches here and gets a 400 automatically. There is no validation code below,
     * and code that tried to duplicate it would be unreachable.
     *
     * 201 CREATED, not 200. The distinction is not pedantry: 200 says "here is your answer",
     * 201 says "a new resource now exists", and the Location header says where. A client that
     * wants to fetch or link to what it just made reads that header rather than assembling a
     * URL from knowledge it should not have.
     *
     * The URI is RELATIVE - "/api/users/4", not "http://localhost:8090/api/users/4". An
     * absolute URL would bake in the host and port this instance happens to be running on,
     * which is wrong the moment the app sits behind a proxy, a container port mapping, or a
     * different environment. A relative reference is legal in Location and resolves against
     * whatever the client actually used to reach us.
     *
     * 409 CONFLICT, not 400, when the service refuses. The request is well-formed; it is the
     * current state of the system that makes it impossible. The same body would have
     * succeeded before that username existed and will succeed again once it is gone, which is
     * exactly what "conflict" means and what "bad request" does not.
     *
     * The 409 says nothing about WHICH of the id, username or email collided - that is the
     * terse-error stance from AGENTS.md, and the reason is account enumeration: a precise
     * message confirms to anyone who asks that a given email is registered here.
     */
    @PostMapping
    public ResponseEntity<User> addUser(@Valid @RequestBody User user)
    {
        return userService.addUser(user)
                .map(created -> ResponseEntity
                        .created(URI.create("/api/users/" + created.getId()))
                        .body(created))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.CONFLICT).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable int id)
    {
        boolean deleted = userService.deleteById(id);
        if (deleted)
        {
            return ResponseEntity.noContent().build(); //204
        }
        else
        {
            return ResponseEntity.notFound().build(); //404
        }
    }
    /*
     * PUT /api/users/{id}
     *
     * The service returns ONE empty Optional that means three different things, and the
     * client needs three different answers. Untangling that is this method's whole job, and
     * it is done by asking the questions this layer can answer BEFORE calling editUser, so
     * that by the time an empty Optional comes back only one meaning is left.
     *
     * The mismatch check belongs here specifically: the controller is the only layer that
     * sees both the path and the body, so it is the only one that can tell they disagree.
     * The service checks it too, and that duplication is deliberate rather than an oversight
     * - the two checks answer different questions. This one asks "is this HTTP request
     * self-contradictory", and answers 400. The service's asks "is this operation coherent
     * at all", and would still refuse a caller that never came through HTTP. Delete the
     * service's copy and a CLI or a scheduled job could do what a browser cannot.
     *
     * 200, not 201: nothing was created. PUT replaced something that already existed, and
     * the response carries the updated record so a client does not have to re-fetch it.
     *
     * Worth noticing the cost: findById here plus the service's own lookup plus the
     * repository's means three round trips for one edit, and between the 404 check and the
     * edit the row could in principle change. Neither matters against a LinkedHashMap with
     * one thread. Both are real once step 7 puts a network between this and the data, which
     * is the point at which "check then act" stops being free.
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> editUser(@PathVariable int id, @Valid @RequestBody User data)
    {
        if (!Objects.equals(data.getId(), id))
        {
            return ResponseEntity.badRequest().build(); //400 - request contradicts itself
        }

        if (userService.findById(id).isEmpty())
        {
            return ResponseEntity.notFound().build(); //404 - PUT does not create
        }

        // by elimination, an empty Optional can now only be the uniqueness conflict
        return userService.editUser(id, data)
                .map(ResponseEntity::ok) //200
                .orElseGet(() -> ResponseEntity.status(HttpStatus.CONFLICT).build()); //409
    }
}
