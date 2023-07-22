.PHONY: all css js

all: css js
css:
	yarn run sass --no-source-map src/style/style.sass public/style.css
js:
	yarn run tsc