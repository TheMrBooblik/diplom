let pcsc = require('pcsclite');

export const getRfid = () => {
    const pcscMiddleware = pcsc();
    let rfid;

    try {
        pcscMiddleware.on('reader', function (reader) {
            console.log('Reader detected', reader.name);
            reader.on('error', function (err) {
                console.log('Error(', this.name, '):', status);
            });
            reader.on('status', function (status) {
                console.log('Reader status', status);
                let changes = this.state ^ status.state;
                if (changes) {
                    if ((changes & this.SCARD_STATE_EMPTY) && (status.state & this.SCARD_STATE_EMPTY)) {
                        console.log("Card was removed");
                        reader.disconnect(reader.SCARD_LEAVE_CARD, function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Disconnect');
                            }
                        });
                    } else if ((changes & this.SCARD_STATE_PRESENT) && (status.state & this.SCARD_STATE_PRESENT)) {
                        console.log('Card was placed on reader');
                        reader.connect({ share_mode: this.SCARD_SHARE_SHARED }, function (err, protocol) {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log('Protocol (', reader.name, '):', protocol);
                                const message = new Buffer([0xFF, 0xCA, 0x00, 0x00, 0x00]);
                                reader.transmit(message, 40, protocol, function (err, data) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log('Data received: ', data);
                                        rfid = data.readUIntBE(0, 6, true).toString(36);
                                        console.log('RFID code: ' + rfid);

                                    }
                                });
                            }
                        });
                    }
                }
            });
        });
    } catch (e) {

    }

    return rfid;
}