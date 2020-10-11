FROM ghcr.io/synthetixio/docker-node/focal:12.19

# avoid too many progress messages
# https://github.com/cypress-io/cypress/issues/1243
ENV CI=1

# disable shared memory X11 affecting Cypress v4 and Chrome
# https://github.com/cypress-io/cypress-docker-images/issues/270
ENV QT_X11_NO_MITSHM=1
ENV _X11_NO_MITSHM=1
ENV _MITSHM=0

# "fake" dbus address to prevent errors
# https://github.com/SeleniumHQ/docker-selenium/issues/87
ENV DBUS_SESSION_BUS_ADDRESS=/dev/null

# point Cypress at the /root/cache no matter what user account is used
# see https://on.cypress.io/caching
ENV CYPRESS_CACHE_FOLDER=${HOME}/.cache/Cypress

# install dependencies
RUN apt-get update && \
  apt-get install --no-install-recommends -y \
  software-properties-common \
  libgtk2.0-0 \
  libgtk-3-0 \
  libnotify-dev \
  libgconf-2-4 \
  libnss3 \
  libxss1 \
  libasound2 \
  libxtst6 \
  xauth \
  xvfb \
  # install Chinese fonts
  fonts-arphic-bkai00mp \
  fonts-arphic-bsmi00lp \
  fonts-arphic-gbsn00lp \
  fonts-arphic-gkai00mp \
  fonts-arphic-ukai \
  fonts-arphic-uming \
  ttf-wqy-zenhei \
  ttf-wqy-microhei \
  xfonts-wqy \
  # Chrome dependencies
  libgbm1 \
  fonts-liberation \
  libappindicator3-1 \
  xdg-utils \
  # Cypress dependencies
  zip \
  mplayer \
  && rm -rf /var/lib/apt/lists/*

# java
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN wget -qO - https://adoptopenjdk.jfrog.io/adoptopenjdk/api/gpg/key/public | apt-key add - \
  && add-apt-repository --yes https://adoptopenjdk.jfrog.io/adoptopenjdk/deb/
RUN apt-get update && \
  apt-get install --no-install-recommends -y \
  adoptopenjdk-8-hotspot \
  && rm -rf /var/lib/apt/lists/*

# install Chrome browser
# hadolint ignore=DL3015
RUN wget -O /usr/src/google-chrome-stable_current_amd64.deb "http://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_85.0.4183.121-1_amd64.deb" && \
  dpkg -i /usr/src/google-chrome-stable_current_amd64.deb ; \
  apt-get install -f -y && \
  rm -f /usr/src/google-chrome-stable_current_amd64.deb

# install Firefox browser
RUN wget --no-verbose -O /tmp/firefox.tar.bz2 https://download-installer.cdn.mozilla.net/pub/firefox/releases/81.0.1/linux-x86_64/en-US/firefox-81.0.1.tar.bz2 \
  && tar -C /opt -xjf /tmp/firefox.tar.bz2 \
  && rm /tmp/firefox.tar.bz2 \
  && ln -fs /opt/firefox/firefox /usr/bin/firefox

# install needed global npm modules
RUN npm install -g @lhci/cli@0.5.0 lighthouse-plugin-field-performance@2.2.0 lighthouse-plugin-social-sharing@0.0.1 lighthouse@6.4.1 sitespeed.io@15.2.0 webdriver-manager@12.1.7 cypress@5.3.0

# install and setup plugins required by sitespeed.io
WORKDIR /usr/local/lib/node_modules/sitespeed.io/lib/plugins
RUN git clone https://github.com/sitespeedio/plugin-lighthouse.git --depth 1 --branch=main && \
  git clone https://github.com/sitespeedio/plugin-gpsi.git --depth 1 --branch=main
WORKDIR /usr/local/lib/node_modules/sitespeed.io/lib/plugins/plugin-lighthouse
RUN npm install
WORKDIR /usr/local/lib/node_modules/sitespeed.io/lib/plugins/plugin-gpsi
RUN npm install && mv lib/* .
WORKDIR $HOME

# install selenium drivers (ChromeDriver, GeckoDriver, etc)
RUN npx webdriver-manager update --ignore_ssl --versions.standalone 3.141.59 --versions.chrome 86.0.4240.22 --versions.gecko v0.27.0

# give every user read access to the "/root" folder where the Cypress binary is cached
# we really only need to worry about the top folder, fortunately
RUN ls -la $HOME
RUN chmod 755 $HOME

# command "id" should print:
# uid=0(root) gid=0(root) groups=0(root)
# which means the current user is root
RUN id

# Cypress cache and installed version
# should be in the root user's home folder
RUN npx cypress verify
RUN npx cypress cache path
RUN npx cypress cache list
RUN npx cypress info

# Node libraries
RUN node -p process.versions

# print versions of local tools
RUN echo  "node version:  $(node -v) \n" \
  "npm version:           $(npm -v) \n" \
  "yarn version:          $(yarn -v) \n" \
  "Selenium version:      3.141.59 \n" \
  "Chrome version:        $(google-chrome --version || true) \n" \
  "Chromedriver version:  86.0.4240.22 \n" \
  "Firefox version:       $(firefox --version || true) \n" \
  "Geckodriver version:   0.27.0 \n" \
  "git version:           $(git --version) \n" \
  "user:                  $(whoami) \n" \
  "ubuntu version:        $(cat /etc/lsb-release)"
