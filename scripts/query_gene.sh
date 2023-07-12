gene=$3
zcat $1 | awk -vid="$2" -vtype="$4" '($1 == id) && $9 ~/'"$gene"'/ && $3 == type'
