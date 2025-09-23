<?php

namespace App\Traits;

use Illuminate\Support\Facades\App;

trait Translatable
{
    /**
     * Get translated attribute value
     */
    public function getTranslatedAttribute($key, $locale = null)
    {
        $locale = $locale ?: App::getLocale();
        
        // Check if translation exists for this attribute
        $translationKey = $this->getTranslationKey($key);
        
        if ($translationKey && __($translationKey, [], $locale) !== $translationKey) {
            return __($translationKey, [], $locale);
        }
        
        // Fallback to original value
        return $this->getAttribute($key);
    }
    
    /**
     * Get translation key for attribute
     */
    protected function getTranslationKey($key)
    {
        $modelName = strtolower(class_basename($this));
        
        return "{$modelName}.{$key}";
    }
    
    /**
     * Get translated difficulty
     */
    public function getTranslatedDifficultyAttribute()
    {
        return $this->getTranslatedAttribute('difficulty.' . $this->difficulty);
    }
    
    /**
     * Get translated icon
     */
    public function getTranslatedIconAttribute()
    {
        return $this->getTranslatedAttribute('icons.' . $this->icon);
    }
    
    /**
     * Get translated category
     */
    public function getTranslatedCategoryAttribute()
    {
        return $this->getTranslatedAttribute('categories.' . $this->category);
    }
}
