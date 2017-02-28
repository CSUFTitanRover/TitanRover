echo "Making the wpa_enterprise.conf file"
(
cat << 'EOF'
interface=/var/run/wpa_supplicant
network={
	ssid="eduroam"
	scan_ssid=1
	key_mgmt=WPA-EAP
	pairwise=CCMP TKIP
	group=CCMP TKIP
	eap=PEAP
	identity="scubastew@csu.fullerton.edu"
	password="Brock!2016"
	phase1="peapver=0"
	phase2="auth=MSCHAPV2"
}
EOF
) > /etc/wpa_supplicant/wpa_enterprise.conf

echo "Running command to connect"

sudo wpa_supplicant -B -i wlan0 -c /etc/wpa_supplicant/wpa_enterprise.conf

