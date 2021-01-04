
echo '开始执行命令'
gitbook build .

# echo '执行命令：cd ./_book\n'
# cd ./_book

echo '执行命令：git add .'
git add .

echo "执行命令：git commit -m 'deploy'"
git commit -m 'deploy'


echo "执行命令：git push"
git push

echo '回到工作目录'
cd -