gene=$4
awk -vid="$2" -valias="$3" -vtype="$5" '($1 == id || $1 == alias) && $9 ~/'"$gene"'/ && $3 == type' < $1
