if [ -z $(git status -s) ]; then 
  source scripts/build.sh
  cp package.json dist/
  cp README.md dist/   
  cp LICENSE dist/
  npm publish dist
else 
  echo "Can't publish git is not clean"
  exit 1;
fi
