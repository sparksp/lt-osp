SHELL = /bin/sh

.PHONY: all build clean deploy-preview branch-deploy production-build serve

all: build ## Build site with production settings

clean:
	-rm -r public

build: clean ## Build site with non-production settings and put deliverables in ./public
	timeout -s SIGABRT 5m hugo --cleanDestinationDir --minify --environment development

deploy-preview: ## Deploy preview site via netlify
	timeout -s SIGABRT 5m hugo --cleanDestinationDir --enableGitInfo --buildFuture --environment preview -b $(DEPLOY_PRIME_URL)

branch-deploy: ## Build site with drafts and future posts enabled
	timeout -s SIGABRT 5m hugo --cleanDestinationDir --buildDrafts --buildFuture --environment preview -b $(DEPLOY_PRIME_URL)

production-build: ## Build the production site and ensure that noindex headers aren't added
	timeout -s SIGABRT 5m hugo --cleanDestinationDir --minify --environment production

serve : ## Boot the development server.
	hugo server --buildFuture --navigateToChanged --watch --environment development
