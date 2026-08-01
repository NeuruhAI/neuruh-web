# P1 / G1 device-validation blocker

- Status: **BLOCKED — NOT FAILED, NOT GREEN**
- Policy remains: **PROVISIONAL TIER-3 POLICY**

This host is an Apple M1 integrated-GPU machine. The controlling matrix also requires a mid-range discrete-GPU Windows laptop, modern Android Chrome, and recent iPhone Safari. Those devices are not connected or otherwise available. The existing spike receipts also omit the exact `trs=0.75` reduced-motion and worst-case rows required by the matrix.

The user made both source repositories read-only, so new device receipts must be returned to an owner-approved location rather than written into the spike repository.

No fallback-ladder result is inferred. Two live membranes remain the only tier-3 working policy, and baked/fresnel remain explicitly non-equivalent fallbacks.
