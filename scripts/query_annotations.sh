awk -vbegin="$2" -vend="$3" '$4 >= begin && $5 <= end' < $1
