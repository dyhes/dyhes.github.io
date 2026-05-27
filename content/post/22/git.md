---
title: 【Git】Concepts
date: 2022-04-13 00:00:00+0000
categories: 
    - nutrition
tags:
    - Git
---

## Introduction

Git is a **version control system**. Git helps you **keep track of code changes.** Git is used to **collaborate** on code.

Git and GitHub are different things. In this tutorial you will understand what Git is and how to use it on the remote repository platforms, like GitHub.

Git allow you to:

- Manage projects with **Repositories**
- **Clone** a project to work on a local copy
- Control and track changes with **Staging** and **Committing**
- **Branch** and **Merge** to allow for work on different parts and versions of a project
- **Pull** the latest version of the project to a local copy
- **Push** local updates to the main project

## work flow

- Initialize Git on a folder, making it a **Repository**
- Git now creates a hidden folder to keep track of changes in that folder
- When a file is changed, added or deleted, it is considered **modified**
- You select the modified files you want to **Stage**
- The **Staged** files are **Committed**, which prompts Git to store a **permanent** snapshot of the files
- Git allows you to see the full history of every commit.
- You can revert back to any previous commit.
- Git does not store a separate copy of every file in every commit, but keeps track of changes made in each commit!

## File States

Files in your Git repository folder can be in one of 2 states:

- Tracked - files that Git knows about and are added to the repository
- Untracked - files that are in your working directory, but not added to the repository

 When you first add files to an empty repository, they are all untracked. To get Git to track them, you need to stage them, or add them to the staging environment.

## Staging Environment

One of the core functions of Git is the concepts of the Staging Environment, and the Commit.

As you are working, you may be **adding, editing and removing** files. But whenever you hit a **milestone** or finish a part of the work, you should add the files to a Staging Environment.

**Staged** files are files that are **ready** to be **committed** to the repository you are working on.

## Commit

Since we have finished our work, we are ready move from `stage` to `commit` for our repo.

Adding commits keep track of our progress and changes as we work. Git considers each `commit` change point or "save point". It is a point in the project you can go back to if you find a bug, or want to make a change.

When we `commit`, we should **always** include a **message**.

Sometimes, when you make small changes, using the staging environment seems like a waste of time. It is possible to commit changes directly, skipping the staging environment. The `-a` option will automatically stage every changed, already tracked file.

Skipping the Staging Environment is not generally recommended.

Skipping the stage step can sometimes make you include unwanted changes.

## Help

If you are having trouble remembering commands or options for commands, you can use Git `help`.

There are a couple of different ways you can use the `help` command in command line:

- `git command -help` - See all the **available options** for the specific command
- `git help --all` - See all possible commands

## Branch

In Git, a `branch` is a new/**separate** version of the main repository.

Branches allow you to work on different parts of a project without impacting the main branch.

When the work is complete, a branch can be merged with the main project.

You can even switch between branches and work on different projects without them interfering with each other.

* **new branch**

  ```bash
  git branch branch-name
  ```

* **list branch**

  ```bash
  git branch
  
  git branch -a (local and fetched remote)
  
  git branch -r (only remote)
  ```

* **delete branch**

  ```bash
  git branch -d branch-name
  ```

* **switch to branch**

  ```bash
  git checkout branch-name
  ```

  **Note:** Using the `-b` option on `checkout` will create a new branch, and move to it, if it does not exist.

* **merge branch**

  `git merge another-branch`

  merge`another-branch`to current branch.

## Undo

### Revert

`revert` is the command we use when we want to take a previous `commit` and add it as a new `commit`, keeping the `log` intact.

Step 1: Find the previous `commit`:

![Git Revert Step 1](https://www.w3schools.com/git/img_revert_part1.gif)

Step 2: Use it to make a new `commit`:

![Git Revert Step 2](https://www.w3schools.com/git/img_revert_part2.gif)

First thing, we need to find the point we want to return to. To do that, we need to go through the `log`.

To avoid the very long log list, we are going to use the `--oneline` option, which gives just one line per commit showing:

- The first seven characters of the `commit hash`
- the `commit message`

We revert the latest `commit` using git `revert HEAD` (`revert` the latest change, and then `commit`), adding the option `--no-edit` to skip the commit message editor (getting the default `revert` message)

```bash
git revert HEAD --no-edit
```

### Reset

`reset` is the command we use when we want to move the repository back to a previous `commit`, **discarding** any changes made after that `commit`.

Step 1: Find the previous `commit`:

![Git Reset Step 1](https://www.w3schools.com/git/img_reset_part1.gif)

Step 2: Move the repository back to that step:

![Git Reset Step 2](https://www.w3schools.com/git/img_reset_part2.gif)

```bash
git reset 9a9add8
```

### Amend

`commit --amend` is used to modify the most recent `commit`.

It combines changes in the `staging environment` with the latest `commit`, and creates a new `commit`.

This new `commit` **replaces** the latest `commit` entirely.

One of the simplest things you can do with `--amend` is to change a `commit` message.

```bash
git commit --amend -m "Added lines to README.md"
```

## Ignore

When sharing your code with others, there are often files or parts of your project, you do not want to share.

Examples

- log files
- temporary files
- hidden files
- personal files
- etc.

Git can specify which files or parts of your project should be ignored by Git using a `.gitignore` file.

Git will not track files and folders specified in `.gitignore`. However, the `.gitignore` file itself **IS** tracked by Git.

## Github

* **add origin**

  ```bash
  git remote add ori(or anything you like) URL
  ```

* **update local**

  When working as a team on a project, it is important that everyone stays up to date.

  Any time you start working on a project, you should get the most recent changes to your local copy.

  With Git, you can do that with `pull`.

  `pull` is a combination of 2 different commands:

  - `fetch`
  - `merge`

  Let's take a closer look into how `fetch`, `merge`, and `pull` works.

  `fetch` gets all the change history of a tracked branch/repo.

  So, on your local Git, `fetch` updates to see what has changed on GitHub:

  ```bash
  git pull ori remote-b
  
  //create new branch in local
  git pull ori remote-b:local-b
  ```

* **update remote**

  ```bash
  git push ori
  
  //create new branch in remote
  git push ori local-b:remote-b
  ```

# Commands

* **init**

  ```bash
  git init
  ```

* **status**

  ```bash
  git status
  
  On branch master
  
  No commits yet
  
  Untracked files:
    (use "git add ..." to include in what will be committed)
      index.html
  
  nothing added to commit but untracked files present (use "git add" to track)
  
  git status --short
   M index.html
  ```

  **Note:** Short status flags are:

  - ?? - Untracked files
  - A - Files added to stage
  - M - Modified files
  - D - Deleted files

* **add**

  ```bash
  git add filename/--all
  ```

  Using `--all` instead of individual filenames will `stage` all changes (new, modified, and deleted) files. The shorthand command for `git add --all` is `git add -A`

* **commit**

  ```bash
  git commit -m "First release of Hello World!"
  
  git commit -a -m "Updated index.html with a new line"
  ```

* **log**

  ```bash
  git log
  commit 09f4acd3f8836b7f6fc44ad9e012f82faf861803 (HEAD -> master)
  Author: w3schools-test 
  Date:   Fri Mar 26 09:35:54 2021 +0100
  
      Updated index.html with a new line
  
  commit 221ec6e10aeedbfd02b85264087cd9adc18e4b26
  Author: w3schools-test 
  Date:   Fri Mar 26 09:13:07 2021 +0100
  
      First release of Hello World!
  ```

  To view the history of commits for a repository, you can use the `log` command

