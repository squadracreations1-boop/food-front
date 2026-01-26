
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const CartAnimation = () => {
    // This component listens for the 'addToCartAnimate' custom event
    useEffect(() => {
        const handleAnimation = (e) => {
            // Fix: Check which icon is actually visible
            const desktopIcon = document.getElementById('cart-icon-container');
            const mobileIcon = document.getElementById('mobile-cart-icon-container');

            // Prioritize the icon that is currently visible (has dimensions)
            let cartIcon = null;
            if (desktopIcon && desktopIcon.getBoundingClientRect().width > 0) {
                cartIcon = desktopIcon;
            } else if (mobileIcon && mobileIcon.getBoundingClientRect().width > 0) {
                cartIcon = mobileIcon;
            } else {
                cartIcon = desktopIcon || mobileIcon;
            }

            if (!cartIcon || !e.detail.imageUrl) return;
            const { imageUrl, startX, startY } = e.detail;

            // Create flying image element
            const flyingImage = document.createElement('img');
            flyingImage.src = imageUrl;
            flyingImage.style.position = 'fixed';
            flyingImage.style.left = `${startX}px`;
            flyingImage.style.top = `${startY}px`;
            flyingImage.style.width = '50px';
            flyingImage.style.height = '50px';
            flyingImage.style.borderRadius = '50%';
            flyingImage.style.objectFit = 'cover';
            flyingImage.style.zIndex = '9999';
            flyingImage.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
            flyingImage.style.pointerEvents = 'none';
            flyingImage.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';

            document.body.appendChild(flyingImage);

            // Force reflow
            flyingImage.getBoundingClientRect();

            // Calculate destination
            const cartRect = cartIcon.getBoundingClientRect();
            const destX = cartRect.left + (cartRect.width / 2) - 25; // Center 50px image
            const destY = cartRect.top + (cartRect.height / 2) - 25;

            // Animate
            requestAnimationFrame(() => {
                flyingImage.style.left = `${destX}px`;
                flyingImage.style.top = `${destY}px`;
                flyingImage.style.transform = 'scale(0.2)';
                flyingImage.style.opacity = '0.8';
            });

            // Cleanup and bump effect
            setTimeout(() => {
                flyingImage.remove();

                // Add bump animation to cart icon
                cartIcon.style.transition = 'transform 0.2s';
                cartIcon.style.transform = 'scale(1.2)';

                setTimeout(() => {
                    cartIcon.style.transform = 'scale(1)';
                }, 200);
            }, 800);
        };

        window.addEventListener('addToCartAnimate', handleAnimation);

        return () => {
            window.removeEventListener('addToCartAnimate', handleAnimation);
        };
    }, []);

    return null; // This component handles DOM manipulation directly for performance
};

export default CartAnimation;
