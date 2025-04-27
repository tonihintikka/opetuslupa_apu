import { useTranslation } from 'react-i18next';
import { Typography, TypographyProps } from '@mui/material';
import { ReactNode } from 'react';

/**
 * Props for the TranslatedText component
 */
interface TranslatedTextProps extends Omit<TypographyProps, 'children'> {
  /** Translation key to use */
  textKey: string;
  /** Namespace for the translation key, defaults to 'common' */
  ns?: string | string[];
  /** Values to interpolate into the translation */
  values?: Record<string, any>;
  /** Component to use for rendering the translated text, defaults to 'p' */
  component?: React.ElementType;
  /** Function to format the translated text */
  formatter?: (text: string) => ReactNode;
  /** Default text to show if translation is missing */
  defaultText?: string;
}

/**
 * Component for displaying translated text with consistent styling
 * 
 * Handles interpolation, formatting, and component mapping in one place
 * for more maintainable internationalized text.
 */
const TranslatedText = ({
  textKey,
  ns,
  values,
  variant,
  component = 'p',
  formatter,
  defaultText,
  ...typographyProps
}: TranslatedTextProps) => {
  const { t } = useTranslation(ns);
  
  // Get translated text with optional interpolation and ensure it's a string
  const translationResult = t(textKey, values || {});
  let translatedText = typeof translationResult === 'string' 
    ? translationResult 
    : JSON.stringify(translationResult);
  
  // If translation is empty and defaultText is provided, use defaultText
  if (!translatedText && defaultText) {
    translatedText = defaultText;
  }
  
  // Apply formatter if provided
  const formattedText = formatter ? formatter(translatedText) : translatedText;
  
  return (
    <Typography variant={variant} component={component} {...typographyProps}>
      {formattedText}
    </Typography>
  );
};

export default TranslatedText; 