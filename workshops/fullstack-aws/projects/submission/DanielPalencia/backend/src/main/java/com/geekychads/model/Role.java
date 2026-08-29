package com.geekychads.model;

/*
 * What a user is allowed to be. Exactly two values, per Planning.md.
 *
 * The constants are spelled TrainingManager and Trainee rather than the usual Java
 * SCREAMING_SNAKE. That is a deliberate trade: Jackson serialises an enum by name(), so
 * naming the constant exactly as the wire value means the Java name and the JSON value
 * cannot drift apart. AGENTS.md section 3 calls a case mismatch here a silent authorization
 * bug, and the alternative - TRAINING_MANAGER plus @JsonProperty("TrainingManager") - keeps
 * the convention but adds a second place the spelling has to be right.
 */
public enum Role
{
    TrainingManager,
    Trainee
}
