SHELL = /bin/sh
target = public

all : $(target) ;

$(target) :
	-rm -r $@
	hugo --gc --minify --destination=$@

.PHONY : clean
clean :
	-rm -r $(target)

.PHONY : serve
serve :
	hugo serve --buildDrafts --buildFuture --navigateToChanged --watch
