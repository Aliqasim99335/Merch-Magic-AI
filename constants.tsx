
import React from 'react';
import { ProductType } from './types';

export const PRODUCTS: ProductType[] = [
  {
    id: 'tshirt',
    name: 'Classic T-Shirt',
    icon: '👕',
    basePrompt: 'A realistic product mockup of a person wearing a clean white premium cotton t-shirt. The uploaded logo should be placed perfectly in the center of the chest. Urban studio lighting, high resolution, 4k.',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
  },
  {
    id: 'hoodie',
    name: 'Premium Hoodie',
    icon: '🧥',
    basePrompt: 'A professional streetwear mockup of a black heavy cotton hoodie. The logo should be visible on the center chest area. Cinematic lighting, soft shadows, detailed texture.',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop'
  },
  {
    id: 'cap',
    name: 'Baseball Cap',
    icon: '🧢',
    basePrompt: 'A high-end product shot of a baseball cap on a wooden table. The logo should be embroidered on the front panel. Macro photography style, sharp focus.',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop'
  },
  {
    id: 'mug',
    name: 'Ceramic Mug',
    icon: '☕',
    basePrompt: 'A cozy lifestyle mockup of a white ceramic coffee mug sitting on a marble countertop next to a laptop. The logo should be printed on the side facing the camera.',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop'
  },
  {
    id: 'tote',
    name: 'Tote Bag',
    icon: '👜',
    basePrompt: 'A clean canvas tote bag hanging on a minimalist wall. The logo should be centered on the bag. Soft natural window lighting, sustainable aesthetic.',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop'
  }
];

export const EDIT_SUGGESTIONS = [
  "Add a retro vintage filter",
  "Change the background to a beach",
  "Make the lighting more dramatic",
  "Add some coffee stains to the background",
  "Add a neon glow effect to the logo"
];
