package com.geekychads;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/*
 * The entry point.
 *
 * SHARED - this is app-shell code, jointly owned by the team (AGENTS.md section 2), not part
 * of the User slice. It exists because nothing runs without it. Whoever creates it first
 * wins; after that it changes only by agreement, because everyone's work boots through it.
 *
 * @SpringBootApplication is three annotations in one, and the third is the one that matters
 * here: @ComponentScan, which scans THIS package and everything below it. That is why the
 * class sits at com.geekychads rather than in a subpackage - it has to be above the layers
 * it is meant to find. A class outside this tree is invisible to Spring no matter how it is
 * annotated, which is the usual cause of a "no qualifying bean" that looks like magic.
 */
@SpringBootApplication
public class GeekyChadsApplication {

    public static void main(String[] args) {
        SpringApplication.run(GeekyChadsApplication.class, args);
    }
}
