package com.geekychads.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.geekychads.model.Role;
import com.geekychads.model.User;

/*
 * Spring Data's view of the users collection. <User, Integer> is the document type and the
 * type of its @Id - Integer, because the id is caller-assigned, which is also why nothing
 * here generates one.
 *
 * Every method below is DERIVED. Spring Data parses the method name at startup and writes
 * the query itself: findByUsername becomes { "username": ?0 }, existsByEmail becomes a count
 * against { "email": ?0 }. There is no implementation to write and none to get wrong.
 *
 * That is a payoff of naming, not luck. These four names were chosen back in steps 3 and 6
 * to read well in UserRepository, and they happen to be exactly Spring Data's grammar - so
 * the in-memory versions, written by hand as stream filters, are replaced here by
 * declarations. Had they been called lookupUser or roleSearch, each would need a manual
 * implementation or an @Query annotation.
 *
 * This interface is NOT the one the service depends on. It is an implementation detail of
 * MongoUserRepository, which wraps it - the same wrapping Banking_App uses, and for the same
 * reason: extending MongoRepository directly would put deleteAll() and two dozen other
 * methods within reach of business logic, and would leak Spring Data's vocabulary upward.
 */
public interface UserMongoRepository extends MongoRepository<User, Integer>
{
    Optional<User> findByUsername(String username);

    List<User> findByRole(Role role);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
