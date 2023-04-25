SHELL = /bin/sh
target = public

all : $(target) ;

$(target) :
	mkdir -p $@
	hugo --gc --destination=$@

.PHONY : clean
clean :
	-rm -r $(target)

.PHONY : serve
serve :
	hugo serve --buildDrafts --navigateToChanged --watch
