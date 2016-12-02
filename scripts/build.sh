#!/bin/bash

# Copyright 2015 creditease Inc. All rights reserved.
# desc 项目构建脚本
# author aiweizhang(aiweizhang@creditease.cn)
# @date 2015/05/25

if [ -z "${SVN_REPO}" ]; then
    echo -e "\033[31mThe SVN_REPO environment variable is not defined correctly\033[0m"
    exit 1;
fi

BASENAME="$(basename `pwd`)"
DIST="dist" #资源输出目录
SVN_DIR="${HOME}/.__svn__/${BASENAME}" #svn项目目录
message="$(git log -1)"
mode=""
branch_name="$(git describe --contains --all HEAD | tr -s '\n')" #分支名

if [ $branch_name == "master" ]; then
    echo "master branch"
elif [ $branch_name == "develop" ]; then
    echo "develop branch"
elif [[ $branch_name == "feature-*" ]]; then
    echo "feature branch"
elif [[ $branch_name == "fixbug-*" ]]; then
    echo "fixbug branch"
elif [[ $branch_name == "release-*" ]]; then
    echo "release branch"
fi

while getopts "r" args
do
    case $args in
        r)
            mode="rev";;
        *)
            exit 1;
    esac
done

echo $BASENAME
echo "-----------------------------"

if [ $mode == "rev" ]; then
    echo -e "\033[32mrevision mode ...\033[0m"
    npm run revision
else
    echo -e "\033[32mnormal mode ...\033[0m"
    npm run build
fi

if [ $? -eq 1 ]; then
    exit 1;
fi

echo -e "\033[32mbuild finished\033[0m"
echo "-----------------------------"

if [ -d $SVN_DIR ]; then
    svn sw $SVN_REPO $SVN_DIR
    svn cleanup $SVN_DIR
else
    svn co --username $SVN_USERNAME --password $SVN_PUBLIC_PASSWORD $SVN_REPO $SVN_DIR
fi

echo -e "\033[33mSVN Repository: ${SVN_REPO}\033[0m"

svn up $SVN_DIR

# 目标模板目录(根据需要自己调整)
views="${SVN_DIR}/views"
# 目标静态资源目录(根据需要自己调整)
assets="${SVN_DIR}/assets"

if [ ! -d $views ]; then
    mkdir -p $views
fi

if [ ! -d $assets ]; then
    mkdir -p $assets
fi

#将打包后资源拷贝至目标目录
mv -f ${DIST}/index.html ${views}/index.html
cp -a ${DIST}/assets/* $assets

# 对所有模板中include/parse的其他模板路径增加前缀(根据需要自己调整)
# find $views -name "*.vm" | xargs sed -i 's/"\([^"]*\.vm"\)/"\/${PREFIX}\/\1/g'

echo "-----------------------------"
svn st $SVN_DIR | grep "^\?" | awk '{print $2"@"}' | xargs svn add
svn st $SVN_DIR | grep "^\!" | awk '{print $2"@"}' | xargs svn rm

echo "-----------------------------"
svn ci $SVN_DIR -m "${message}"
echo "-----------------------------"
