if [ -z $(git diff-index --quiet HEAD) ]; then 
  echo "Can't publish git is not clean"
  exit 1;
else 
   cp package.json dist/
   cp README.md dist/
   cp LICENSE dist/
fi