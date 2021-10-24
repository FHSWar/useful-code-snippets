#!/bin/sh
# ECHO COMMAND
echo Hello World!

# VARIABLE
# Uppercase by convention
NAME="Fhs"
echo "My name is $NAME"
echo "My name is ${NAME}"
echo "\$ 和 \${} 都可以"

# USER INPUT
read -p "Enter your name:" NAME
echo "Hello $NAME, nice to meet you"

# SIMPLE IF STATEMENT (不只是取变量，各种用到操作符的，变量都得用且只能用双引号包起来)
if [ "$NAME" == "fhs" ]
then
    echo "$NAME 是电脑的拥有者"
elif [ "$NAME" == "xhx" ]
then
    echo "$NAME 还是那么好看"
else
    echo "哦"
fi

# FILE CONDITIONS (文件的操作直接用操作符就能搞定，也很说明这个语言的用处了)
########
# -d file   True if the file is a directory
# -e file   True if the file exists (note that this is not particularly portable, thus -f is generally used)
# -f file   True if the provided string is a file
# -g file   True if the group id is set on a file
# -r file   True if the file is readable
# -s file   True if the file has a non-zero size
# -u    True if the user id is set on a file
# -w    True if the file is writable
# -x    True if the file is an executable
########
FILE="test.txt"
if [ -f "$FILE" ] #  
then
  echo "$FILE exists"
else
  echo "$FILE does NOT exist"
fi

#CASE STATEMENT
read -p "Are you 21 or over? Y/N " ANSWER
case "$ANSWER" in 
  [yY] | [yY][eE][sS])
    echo "You can have a beer :)"
    ;;
  [nN] | [nN][oO])
    echo "Sorry, no drinking"
    ;;
  *)
    echo "Please enter y/yes or n/no"
    ;;
esac

# COMPARISON
# -eq -ne -gt -ge - lt -le
# BOOLEAN
# -a -o !
NUM1=1
NUM_1=1
NUM2=2
NUM_2=2
NUM3=3
NUM_3=3
if [ "$NUM1" == "$NUM_1" -a "$NUM2" == "$NUM_2" -a "$NUM3" == "$NUM_3" ]
then
    echo "演示与运算和比较运算，其他运算一样的"
fi

# WHILE LOOP - READ THROUGH A FILE LINE BY LINE (最后一行打印不出来，所以要在最后一行多敲一个回车，和 eslint 规矩联系起来了)
LINE=1
while read -r CURRENT_LINE
  do
    echo "$LINE: $CURRENT_LINE"
    ((LINE++))
done < "./test.txt"

# FOR LOOP
NAMES="Brad Kevin Alice Mark"
for NAME in $NAMES
  do
    echo "Hello $NAME" # 居然根据空格遍历字符串，牛逼啊
done

FILES=$(ls *.txt) # 这个遍历改名能找到同级往下的嵌套文件夹的 txt 文件但是做改动会失败，毕竟 mv 传的其实是路径
NEW="new"
for FILE in $FILES  
  do
    echo "Renaming $FILE to new-$FILE"
    mv $FILE $NEW-$FILE
done

# FUNCTION
function sayHello() {
  echo "Hello World"
}
sayHello

function greet() {
  echo "Hello, I am $1 and I am $2"
}
greet "fhs" "24"


# CREATE FOLDER AND WRITE TO A FILE
mkdir hello
touch "hello/world.txt"
echo "Hello World" >> "hello/world.txt"
echo "Created hello/world.txt"