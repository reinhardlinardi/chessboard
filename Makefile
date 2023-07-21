.PHONY: all clean html css js

all: html css js
clean:
	rm -rf public/*

html:
	yarn run pug src/layout -o public -P
css:
	yarn run sass src/style/style.sass public/style.css
js:
	yarn run tsc