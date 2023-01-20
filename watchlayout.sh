file=$1
shift
arg=$1
shift

function REQUIRE()
{
package="$2"
if [ -z "$2" ]
then
   package=$1
fi
if ! command -v "$1" &> /dev/null
then
    echo " command $1 could not be found; consider sudo apt install $package on Ubuntu"
    exit
fi    
}

REQUIRE "tmux"
REQUIRE "inotifywait" "inotify-tools"


if [ -z "$arg" ]
then
      arg="--all"
fi

myself="${BASH_SOURCE[0]}"

# ; tmux kill-session -t pseudoide

if [ "$arg" = "--all" ]
then
xdot .main.dot &
tmux new -s pseudoide -d "$myself $file --original"
tmux set -g mouse on
tmux split-window -h "$myself $file --layout"
tmux split-window -h "$myself $file --vtable"
tmux select-layout even-horizontal
#tmux split-window -l 1 "$myself $file --cfg"
#tmux set-option -ag status-right "#[fg=red,dim,bg=default]#(uptime | cut -f 4-5 -d ' ' | cut -f 1 -d ',') "
tmux set-option -ag status-right "#[fg=red,dim,bg=default] #(echo $file) "
touch "$file"
tmux attach -t pseudoide
exit 0
fi

echo "Watching file $1 for changes"
inotifywait -e CLOSE_WRITE -e MODIFY -m "$file" |
   while read _; do 
     clear
     case $arg in 
        "--layout") clang -cc1 -x c++ -v -fdump-record-layouts -emit-llvm "$file" | sed '/IRgen/q' | head -n -2 ;;
        "--vtable") clang -cc1 -fdump-vtable-layouts -emit-llvm "$file" ;;
        "--code") clang -O1 -S -emit-llvm -fno-discard-value-names "$file" -o /dev/stdout | c++filt | sed '/attributes #0/q' | head -n -2 ;;
        "--original")  pygmentize $file ;;
        "--cfg") clang -O1 -S -emit-llvm -fno-discard-value-names "$file" -o /dev/stdout | opt --dot-cfg -cfg-func-name="main" ;;
     esac
   done
