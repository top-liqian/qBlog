# git 相关的面试题

1. merge和rebase的区别

+ git merge 会让2个分支的提交按照提交时间进行排序，并且会把最新的2个commit合并成一个commit。最后的分支树呈现非线性的结构
+ git reabse 将dev的当前提交复制到master的最新提交之后，会形成一个线性的分支树