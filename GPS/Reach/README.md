Reach System Requirements
===========================================================================================

ADD to /etc/network/interface file

    allow-hotplug usb0
    auto usb0
    iface usb0 inet static
        address 192.168.2.2
        netmask 255.255.255.0


=============

Startup script required 
