if [ -z "$1" ]; then 
  echo "Provide type of update major, minor, patch"
  exit 1;
else 
   cp package.json dist/
   cp README.md dist/
   cp LICENSE dist/
   npm version $1
fi