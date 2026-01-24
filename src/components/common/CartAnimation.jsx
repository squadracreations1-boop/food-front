
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const CartAnimation = () => {
    // This component listens for the 'addToCartAnimate' custom event
    useEffect(() => {
        const handleAnimation = (e) => {
            const { startX, startY, imageUrl } = e.detail;
            const cartIcon = document.getElementById('cart-icon-container') || document.getElementById('mobile-cart-icon-container');

            if (!cartIcon || !imageUrl) return;

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
