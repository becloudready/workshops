package com.geekychads.model;

import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class User
{
    // assigned by the CALLER, not generated. that is what @NotNull buys: a create with no
    // id is rejected rather than stored half-formed. @Positive because ids count upward from
    // one and a negative id is a typo, never a record.
    //
    // @Id marks this as the document identifier, which mongo stores as _id. spring data
    // would infer it from the field NAME alone, but being explicit means a rename cannot
    // silently demote the primary key to an ordinary field.
    @Id
    @NotNull
    @Positive
    private Integer id;

    @NotBlank
    private String username;

    @NotBlank
    @Email 
    private String email;

    //not adding constraints, leaving that to frontend and specific hash implementation
    @NotBlank
    // WRITE_ONLY: jackson may read this from a request body but must never write it to a
    // response. a hash is not a secret the way a password is, but it is the input to an
    // offline cracking attempt, and a directory endpoint that returns one per user turns a
    // single GET /api/users into a stolen credential database.
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String passwordHash;

    @NotNull
    private Role role;

    // training_progress: how many modules are done, and how many there are. two numbers,
    // because "how far from finishing" is half the definition and a flag cannot carry it.
    //
    // TRACKED, NEVER SET BY A USER. there is deliberately no setter and no endpoint that
    // writes these. what a trainee actually changes is an assignment's completion, which
    // lives in a teammate's domain; this is the reading taken afterwards.
    //
    // OPEN SEAM: the counts are derived from assignment data this slice does not own, so
    // who writes them is undecided - a denormalised copy kept current by the assignment
    // side, or computed on read through a service-to-service call. Both keep the fields
    // read-only here, which is why the model can be written before that is settled.
    private int completedModules;
    private int totalModules;

    // required by jackson to build the object before the setters run
    public User()
    {
    }

    // the id is a constructor parameter and has no setter. that pairing is the whole
    // guarantee: an id is chosen when the object is built and cannot be changed afterwards,
    // so nothing can quietly repoint a record at a different identity.
    public User(Integer id, String username, String email, String passwordHash, Role role)
    {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        // a new user has completed nothing and is enrolled in nothing yet
        this.completedModules = 0;
        this.totalModules = 0;
    }

    public Integer getId()
    {
        return id;
    }

    public String getUsername()
    {
        return username;
    }

    public String getEmail()
    {
        return email;
    }

    public String getPasswordHash()
    {
        return passwordHash;
    }

    public Role getRole()
    {
        return role;
    }

    public int getCompletedModules()
    {
        return completedModules;
    }

    public int getTotalModules()
    {
        return totalModules;
    }

    // derived, not stored - so it cannot disagree with the counts it is computed from.
    // this is what backs ?status=complete|incomplete on the progress endpoint.
    public boolean isTrainingCompleted()
    {
        return totalModules > 0 && completedModules == totalModules;
    }

    //PUT /api/user/{id} allows setting all of these. using full replacement. id itself cannot be set.
    public void setRole(Role newRole)
    {
        role = newRole;
    }

    public void setUsername(String newName)
    {
        username = newName;
    }

    public void setEmail(String newEmail)
    {
        email = newEmail;
    }

    public void setPasswordHash(String newPasswordHash)
    {
        passwordHash = newPasswordHash;
    }
    // called by the assignment side when a module is finished. NOT a pair of setters: the
    // two counts are one fact, and setting them separately lets the object briefly describe
    // something untrue - 5 of 3 completed - between the two calls.
    //
    // it takes recomputed totals rather than incrementing. an increment is not idempotent:
    // a retried request or a replayed event counts the same module twice, and the error is
    // permanent because nothing afterwards can tell the count was ever wrong. passing the
    // recomputed pair makes a duplicate call a no-op.
    //
    // the guard lives here rather than in the service because it is true of every User for
    // all time. a service decides whether THIS caller may act; the model decides what a
    // User is allowed to be.
    public void updateProgress(int completed, int total)
    {
        if (total < 0 || completed < 0 || completed > total)
        {
            throw new IllegalArgumentException("invalid progress: " + completed + " of " + total);
        }

        completedModules = completed;
        totalModules = total;
    }

    // no setId, and no assignId either. an id arrives through the constructor and never
    // changes, so there is no second door to guard - the guarantee is structural rather than
    // enforced by a check somebody has to remember to write correctly.
    //
    // no setters for the module counts - see the field comment. the invariant is that no
    // user sets another user's progress, and the strongest way to enforce that is to give
    // the API no way to write it at all.
}
