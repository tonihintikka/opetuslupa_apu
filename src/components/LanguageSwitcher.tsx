import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Menu, MenuItem, ListItemText } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

/**
 * Language switcher component for changing the application language
 *
 * Uses the i18next react hook and provides a dropdown menu with language options
 */
const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation('settings');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    handleClose();
  };

  // Map of language codes to their full names
  const languages = {
    fi: t('language.finnish'),
    en: t('language.english'),
    sv: t('language.swedish'),
  };

  // Get current language
  const currentLanguage = i18n.language;

  return (
    <Box>
      <Button
        id="language-button"
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        startIcon={<LanguageIcon />}
        color="inherit"
        size="small"
      >
        {languages[currentLanguage as keyof typeof languages] || languages.fi}
      </Button>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
      >
        <MenuItem onClick={() => changeLanguage('fi')} selected={currentLanguage === 'fi'}>
          <ListItemText>Suomi</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => changeLanguage('en')} selected={currentLanguage === 'en'}>
          <ListItemText>English</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => changeLanguage('sv')} selected={currentLanguage === 'sv'}>
          <ListItemText>Svenska</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;
