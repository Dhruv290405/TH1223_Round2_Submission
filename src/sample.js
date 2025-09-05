const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');

// Generate QR code when pilgrim registers
app.post("/api/passes/generate", async (req, res) => {
    try {
        const { aadhaarNumber, selectedGhat } = req.body;
        
        const user = await User.findOne({ aadhaarNumber });
        if (!user) {
            return res.status(404).send("Pilgrim not found");
        }

        // Create verification token
        const token = jwt.sign({
            userId: user._id,
            aadhaar: user.aadhaarNumber,
            ghat: selectedGhat,
            timeSlot: {
                checkIn: user.timeSlot.checkIn,
                checkOut: user.timeSlot.checkOut
            }
        }, 'your-secret-key', { expiresIn: '3d' });

        // Generate QR code containing the token
        const qrCode = await QRCode.toDataURL(token);

        // Update user
        user.selectedGhat = selectedGhat;
        user.pass = token;
        await user.save();

        res.status(201).json({
            message: "Pass generated successfully",
            qrCode,
            ghat: selectedGhat
        });

    } catch (err) {
        res.status(400).send("Error generating pass: " + err.message);
    }
});

// Verify QR code when scanned at ghat
app.post("/api/passes/verify", async (req, res) => {
    try {
        const { token, ghatLocation } = req.body;
        
        // Verify token
        const decoded = jwt.verify(token, 'your-secret-key');
        
        // Find user
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).send("Pilgrim not found");
        }

        // Verify ghat matches
        if (decoded.ghat !== ghatLocation) {
            return res.status(400).send("Invalid ghat location");
        }

        // Check if within time slot
        const now = new Date();
        if (now < user.timeSlot.checkIn || now > user.timeSlot.checkOut) {
            return res.status(400).send("Invalid time slot");
        }

        // Update verification status
        user.verificationStatus = {
            isVerified: true,
            verifiedAt: now,
            verifiedAtGhat: ghatLocation
        };
        await user.save();

        res.status(200).json({
            message: "Pilgrim verified successfully",
            pilgrimName: user.fullName,
            timeSlot: user.timeSlot
        });

    } catch (err) {
        res.status(400).send("Verification failed: " + err.message);
    }
});