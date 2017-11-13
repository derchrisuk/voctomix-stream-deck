import sys
import signal
import os
import usb1
from struct import pack, unpack
import time
import signal
import errno

VENDOR_ID = 0x0fd9
DEVICE_ID = 0x0060
BUFFER_SIZE = 8191
ENDPOINT = 1 

def signal_handler(signal, frame):
    print('break!')
    sys.exit(0)

def getDeviceHandle(context, vendor_id, device_id, usb_device=None):
    if usb_device is None:
        return context.openByVendorIDAndProductID(vendor_id, device_id)
    bus_number, device_address = usb_device
    for device in context.getDeviceList():
        if bus_number != device.getBusNumber() \
              or device_address != device.getDeviceAddress():
            continue
        if (device.getVendorID() == vendor_id and
            device.getProductID() == device_id):
            return device.open()
        raise ValueError(
            'Device at %03i.%03i is not of expected type: '
            '%04x.%04x, %04x.%04x expected' %
            usb_device + (vendor_id, device_id),
        )

def main():
    signal.signal(signal.SIGINT, signal_handler)
    from optparse import OptionParser
    parser = OptionParser()
    parser.add_option(
        '-c', '--config', default='~/.voctomix-stream-deck.conf',
        help='Path to config file',
    )
    parser.add_option(
        '-d', '--device',
        help='USB device to use, in "bus.dev" format',
    )
    parser.add_option(
        '-v', '--verbose', action='store_true',
        help='Print informative messages to stderr',
    )
    (options, args) = parser.parse_args()
    if options.config is None:
        parser.print_help(sys.stderr)
        sys.exit(1)
    if options.device is None:
        usb_device = None
    else:
        usb_device = options.device.split('.')
        assert len(usb_device) == 2
        usb_device = (int(usb_device[0]), int(usb_device[1]))
    verbose = options.verbose

    with usb1.USBContext() as context:
        handle = getDeviceHandle(context, VENDOR_ID, DEVICE_ID, usb_device)
        if handle is None:
            print >>sys.stderr, 'Elgato Stream Deck not found'
            sys.exit(1)
        handle.setConfiguration(0)
        handle.claimInterface(0)

        while True:
	    data = handle.bulkRead(ENDPOINT, BUFFER_SIZE)
	    print("".join("%02x" % i for i in data))

if __name__ == '__main__':
    main()
