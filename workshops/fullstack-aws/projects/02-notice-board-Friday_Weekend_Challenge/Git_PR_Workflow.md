---- Explaination for Git and PR Workdlow ------------------------

(1)
Group1 has 5 members:

-Member1, Member2, Member3, Member4, Member5

(2)
Member1 goes to this repo on Github web browser: 
https://github.com/rohity294/chandan-workshops

FORKS the repo to Member1 Github account.
Member1 goes to project settings and adds as collaborator: Member2,3,4
Now all members are working on the FORK

(3)
Member2,3,4 accepts the project invite

(4)
All members follow the below process

-Clone the FORK project locally

-Under workshops/ fullstack-aws / submissions
Create a sub-folder like "Group1_Member1_Member2_Member3_Member4
All members of group1 will use this subfolder "Group1_Member1_Member2_Member3_Member4" for putting all their work

(5) workshops/ fullstack-aws / submissions/Group1_Member1_Member2_Member3_Member4 /

    
          >frontend
          >backend
          >ReadMe.md
          >Architecture.md
          >postmanscript

(6) Work as a group with individual features divided amomg members
Git add
Git Commit -m "message"
Git push origin master // push and integrate all work under the FORK REPO

(7) Each member of each group to create a PR, going from
source: ForkedRepo 
                  -> 
destination: Chandan's BeCloudReady Repo

(8) While creating the PR on the FORK, you can assign your team-members as PR Reviewers and practice PR reviews.

-------------------------------------------------------------------
Sample project/ directory / folder structure

projects/
├── 01-task-tracker
├── 02-notice-board-Friday_Weekend_Challenge/
│   ├── Deployment/
│   ├── .gitignore
│   ├── ASSIGNMENT-Version1-DeployWith_AwsGui.md
│   ├── BusinessRequirement.md
│   └── Git_PR_Workflow.md
├── 03-url-bookmark-saver
├── 04-architecture-diagram
└── submissions\Group1_Member1_Member2_Member3_Member4/
    ├── backend/
    ├── frontend/
    ├── Architecture.md
    └── ReadMe.md
-----------------------------------------------------------------