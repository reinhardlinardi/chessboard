.PHONY: all clean html css js

all: html css js
clean:
	rm -rf public/*.html public/*.css public/*.js

html:
	yarn run pug src/layout/index.pug -o public -P
css:
	yarn run sass --no-source-map src/style/style.sass public/style.css
js:
	yarn run tsc