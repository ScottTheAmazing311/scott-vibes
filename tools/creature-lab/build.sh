#!/bin/zsh
# Rebuilds public/kidzone/cauldron/_framework, the WebAssembly build of Procedural Pixel Creatures
# that Creature Cauldron runs. Needs the .NET 8 SDK and a clone of the generator; both live on
# Echo Base so the internal disk stays clear.
set -e
source "/Volumes/Echo Base/dev-tools/env.sh"
here="$(cd "$(dirname "$0")" && pwd)"
out="/Volumes/Echo Base/dev-tools/creature-lab/publish"
dotnet publish "$here/CreatureLab.csproj" -c Release -o "$out"
dest="$here/../../public/kidzone/cauldron/_framework"
rm -rf "$dest" && mkdir -p "$dest"
for f in "$out/wwwroot/_framework/"*; do
  case "$f" in *.br|*.gz) ;; *) cp "$f" "$dest/" ;; esac
done
echo "Copied to $dest"
