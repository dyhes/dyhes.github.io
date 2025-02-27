---
title: 【Git】Update Author Information
date: 2024-07-13 00:00:00+0000
categories: 
    - nutrition
tags:
    - Git
---
```bash
git filter-branch --env-filter '
CORRECT_NAME="dyes"
CORRECT_EMAIL="1325574784@qq.com"
if [ "$GIT_COMMITTER_EMAIL" != "$CORRECT_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" != "$CORRECT_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
```
然后执行
```bash
git push --force --tags origin 'refs/heads/*'
```