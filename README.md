# magazine-miniprogram
## local db for dev.
cd mock
mock -e magazine.edn

## generate files for weixin cloud
mock -j temp/magazine_script.edn magazine.sch

