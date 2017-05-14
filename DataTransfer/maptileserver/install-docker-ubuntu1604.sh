# Docker installation script for Ubuntu 16.04 (Xenial) on Azure
# Usage: execute sudo -i, first.
# wget -q -O - "$@" https://gist.githubusercontent.com/tsaqib/9c7c6eed460930b1a14665043bd2157c/raw/ --no-cache | sh
# After running the script reboot and check whether docker is running.

apt-get update -y
apt-get upgrade -y
apt-get install -y apt-transport-https ca-certificates

apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D

apt-get update -y
apt-get install -y linux-image-extra-$(uname -r)

rm -f /etc/apt/sources.list.d/docker.list
su -c "echo 'deb https://apt.dockerproject.org/repo ubuntu-xenial main' >> /etc/apt/sources.list.d/docker.list"
apt-get update -y
apt-get purge lxc-docker
apt-cache policy docker-engine
apt-get update -y
apt-get install -y docker-engine
service docker start


