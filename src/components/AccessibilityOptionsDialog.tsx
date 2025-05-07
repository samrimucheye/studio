
"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface AccessibilityOptionsDialogProps {
  children: ReactNode;
  onDialogClose?: () => void;
}

type FontSize = 'small' | 'medium' | 'large';
type ContrastMode = 'default' | 'high-contrast-light' | 'high-contrast-dark';

const AccessibilityOptionsDialog: React.FC<AccessibilityOptionsDialogProps> = ({ children, onDialogClose }) => {
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [contrastMode, setContrastMode] = useState<ContrastMode>('default');
  const [highlightLinks, setHighlightLinks] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  // Effect to set isMounted to true after the initial render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Effect to load settings from localStorage once mounted
  useEffect(() => {
    if (isMounted) {
      const savedFontSize = localStorage.getItem('accessibility-font-size') as FontSize | null;
      const savedContrastMode = localStorage.getItem('accessibility-contrast-mode') as ContrastMode | null;
      const savedHighlightLinks = localStorage.getItem('accessibility-highlight-links');

      if (savedFontSize) setFontSize(savedFontSize);
      if (savedContrastMode) setContrastMode(savedContrastMode);
      if (savedHighlightLinks) setHighlightLinks(savedHighlightLinks === 'true');
    }
  }, [isMounted]); // Depend on isMounted

  // Effect to apply settings to the DOM when they change, only if mounted
  useEffect(() => {
    if (isMounted) {
      // Apply font size
      document.documentElement.dataset.fontSize = fontSize;
      localStorage.setItem('accessibility-font-size', fontSize);

      // Apply contrast mode
      document.documentElement.dataset.contrast = contrastMode;
      localStorage.setItem('accessibility-contrast-mode', contrastMode);
      // Remove other contrast classes if any
      document.body.classList.remove('high-contrast-light', 'high-contrast-dark');
      if (contrastMode === 'high-contrast-light') {
        document.body.classList.add('high-contrast-light');
      } else if (contrastMode === 'high-contrast-dark') {
        document.body.classList.add('high-contrast-dark');
      }


      // Apply link highlighting
      if (highlightLinks) {
        document.documentElement.dataset.highlightLinks = 'true';
      } else {
        delete document.documentElement.dataset.highlightLinks;
      }
      localStorage.setItem('accessibility-highlight-links', String(highlightLinks));
    }
  }, [fontSize, contrastMode, highlightLinks, isMounted]); // Depend on settings and isMounted

  const handleResetSettings = () => {
    setFontSize('medium');
    setContrastMode('default');
    setHighlightLinks(false);
  };

  // Always render Dialog and DialogTrigger
  // Conditionally render DialogContent based on isMounted to avoid hydration issues with content dependent on localStorage
  return (
    <Dialog onOpenChange={(isOpen) => {
      if (!isOpen && onDialogClose) {
        onDialogClose();
      }
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {isMounted && ( // Only render DialogContent after mounting on the client
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Accessibility Options</DialogTitle>
            <DialogDescription>
              Customize the appearance of the website for better readability.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Font Size */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fontSize" className="text-right col-span-1">
                Font Size
              </Label>
              <RadioGroup
                id="fontSize"
                value={fontSize} // Use value for controlled component
                onValueChange={(value: string) => setFontSize(value as FontSize)}
                className="col-span-3 flex space-x-2"
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="small" id="fs-small" />
                  <Label htmlFor="fs-small">Small</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="medium" id="fs-medium" />
                  <Label htmlFor="fs-medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="large" id="fs-large" />
                  <Label htmlFor="fs-large">Large</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Contrast Mode */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contrastMode" className="text-right col-span-1">
                Contrast
              </Label>
              <RadioGroup
                id="contrastMode"
                value={contrastMode} // Use value for controlled component
                onValueChange={(value: string) => setContrastMode(value as ContrastMode)}
                className="col-span-3 flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="cm-default" />
                  <Label htmlFor="cm-default">Default</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high-contrast-light" id="cm-hcl" />
                  <Label htmlFor="cm-hcl">High Contrast (Light)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high-contrast-dark" id="cm-hcd" />
                  <Label htmlFor="cm-hcd">High Contrast (Dark)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Highlight Links */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="highlightLinks" className="text-right col-span-1">
                Highlight Links
              </Label>
              <Switch
                id="highlightLinks"
                checked={highlightLinks}
                onCheckedChange={setHighlightLinks}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={handleResetSettings}>Reset to Defaults</Button>
            <DialogClose asChild>
              <Button type="button">Done</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default AccessibilityOptionsDialog;

