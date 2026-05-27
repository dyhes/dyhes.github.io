---
title: 【Linux】Basics
date: 2022-11-07 00:00:00+0000
categories: 
- nutrition
tags:
- Linux
---

## History

When Linus Torvalds was studying at the University of Helsinki, he was using a version of the UNIX operating system called 'Minix'. Linus and other users sent requests for modifications and improvements to Minix's creator, Andrew Tanenbaum, but he felt that they weren't necessary. That's when Linus decided to create his own operating system that would take into account users' comments and suggestions for improvements.

In 1991, ideal conditions existed that would create Linux. In essence, Linus Torvalds had a kernel but no programs of his own, Richard Stallman and GNU had programs but no working kernel. Late in 1991, Linus Torvalds had his kernel and a few GNU programs wrapped around it so it would work well enough to show other people what he had done. 

## Distributions

The three most popular Desktop distributions of Linux are;

1. [Fedora](https://www.linux.org/resources/fedora.12/)
2. [Ubuntu](https://www.linux.org/resources/ubuntu-desktop.10/)
3. [Linux Mint](https://www.linux.org/resources/linux-mint.16/)

The four most popular Server versions of Linux are;

1. [Debian](https://www.linux.org/resources/debian.11/)
   The Debian Project was founded by Ian Murdock in 1993. Debian gets its name from the combination of Ian Murdock and his wife Debra's name (Deb-Ian) .Despite its not-for-profit status, Debian is an extremely versatile distribution. It forms the base of many user-friendly distributions like Ubuntu, Linspire and Xandros. 

   mv sources.list.old sources.list

2. [CentOS](https://www.linux.org/resources/centos.8/) (Linux.org runs on a CentOS Linux VPS)

3. [OpenSUSE](https://www.linux.org/resources/opensuse.15/)

4. [Slackware](https://www.linux.org/resources/slackware.9/)

## install new software

* dpkg
* dselect
* rpm
* yum

## File System

### /

This will get you into the 'root' or main directory, not /root

#### root

root user's home directory

#### home

directory that contains non-root user's home directory

#### bin

bin/ is one of the most important directories in Linux. You'll find all of the most used commands there. Right now you should be seeing a lot of red (or green, depending on your version of Linux). Those are programs.

#### sbin

This directory is like /bin in that it has frequently used programs in it, but they're only meant to be used by root. 

#### etc

This houses most of the configuration files for Linux. 

#### dev

 These are the devices that your system uses or can use.

#### boot

where the Linux kernel usually is.

#### tmp

/tmp is a directory that is used to store temporary files, as the name may suggest.

#### var

/var is a directory for certain files that may change their size (i.e. variable size) For example, there are a few excellent databases for Linux. One is called MySQL. Normally, MySQL keeps its data in a subdirectory of /var called /var/mysql/.

#### usr

unix system resources

containing dynamically combined programs, user files and manually-installed programs

The usr/ directory contains files and programs meant to be used by all of the users on the system.

#### lib

/lib is for library files. That's where the name /lib comes from.

#### other directories

Most installations of Linux will also provide these directories:

/mnt
/cdrom
/floppy

These shouldn't contain anything. Later on, we'll explain in more detail what these are for. Let's just say that in Linux, if you want to see what's on a floppy disk or a CD, you're not going to be able to just click on an 'a:' icon or a 'd:' icon. You're going to do

### File Permission

Let's look at what these symbols mean:

start with -(d for directories)

#### three entity types

* owner
* group
* world

##### permission symbol

* r:read 4
* w:write 2
* x:execute 1

## File Backup

### tar

an archiving utility

```bash
tar -cvf(create verbose file) tarname files

tar -czvf(create zip verbose file) tar.gzName files
```

 'tar' just assembles the files together into only one file. There is no reduction in the size of these files (the tarball might even be bigger!) Now we would have to do one more thing in order to reduce this file into a more manageable size: use 'gzip'.

```bash
tar -zxvpf my_tar_file.tar.gz
```

-z - unzip the file first
-x - extract the files from the tarball
-v - \&quot;verbose\&quot; (i.e tar tells you what files it's extracting)
-p - preserves dates, permissions of the original files
-f - use the file in question (if you don't specify this, tar just sort of sits around doing nothing)

### gzip

```bash
gzip tar_file.tar
```

the file extension becomes .tar.gz

## Text Editor

### vi

The most popular text editor for Linux is called 'vi'. This is a program that comes from UNIX. There is a more recent version called 'vim' which means 'vi improved'.

```bash
ESC + i start editing
ESC + :w save
ESC + ：wq save and quit
ESC + :q quit without saving
ESC + :q! quit without saving and warning
```

### joe

```bash
Ctrl+k+h
```

### pico

...

## User

### adduser

create a new user or update default new user information

## userdel

delete a user

### passwd

change user password

## Package

### slackware

```bash
installpkg file.tgz
removepkg file.tgz
upgradepkg file.tgz
```

### debian

```bash
dpkg file.deb

(advanced package tool)
apt-setup
apt-get update
apt-get install package.deb
apt-get remove package.deb
apt-get upgrade [p]
```







## Commands

### shutdown

```bash
shutdown -h(halt) now
shutdown -r(reboot) now
shutdown -r now
shutdown -h +5 (5 minutes)
```

### man

This command will show the manual for a command or program. The manual is a file that shows you how to use the command and list the different options for the command in question. 

```bash
man mkdir
```

### info

Typing info [command name] will get you more information on a command and is more current than most man files and perhaps a little more readable. In fact, some 'man' files will actually tell you to consult the 'info' file. The 'info' files are not always installed automatically. so you may want to consult your own version of Linux about these files.

### whatis

display one-line manual page descriptions

### apropos

search the manual page names and descriptions

### chmod

Change access permissions

```bash
chmod 644 myDoc.txt
```

### chown

Change file owner and group

```bash
chown owner.group filename
chown bob.bob example.txt
```

### last

show a listing of last logged in users

### df

report file system disk space usage

### free

Display amount of free and used memory in the system

### du

```bash
du -b filename
```

### ps

report a snapshot of the current processes

### kill

```bash
kill PID
```

kill a process

### mkdir

make directories

### rmdir

remove empty directories

### rm

remove files or directories

### mv

move or rename files

```bash
mv tonyd/(dir) my_friends/(dir)
```

### cp

copy files and directories

### touch

change file timestamps

### find

search for files

### grep

prints lines that contain a match for one or more patterns

### who

prints information about users who are currently logged on.

### tee

read from standard input and write to standard output and files

\> does the same without |

```bash
ls -l | tee directory_listing
date > directory_listing
date >> directory_listing(append)
```

### whereis

locate the binary,source, and manual page files for a command

### which

locate a command

### echo 

display a line of text

### wc

print newline, word, and byte counts for each file

### dir

list directory contents

### pwd

print working directory

### cal

displays a calendar and the adte of Easter

### \<TAB>

auto complete

### up arrow

show last command

### down arrw

most recent commands

