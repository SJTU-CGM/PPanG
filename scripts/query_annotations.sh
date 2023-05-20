if [ $# -gt 3 ]; then
	awk -vbegin="$2" -vend="$3" -vid="$4" -valias="$5" '($1 == id || $1 == alias) && $5 >= begin && $4 <= end' < $1
else
	awk -vbegin="$2" -vend="$3" '$5 >= begin && $4 <= end' < $1
fi
