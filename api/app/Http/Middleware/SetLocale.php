<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get language from header, query parameter, or default to 'en'
        $locale = $request->header('Accept-Language', 'en');
        
        // Extract language code (e.g., 'en' from 'en-US')
        $locale = substr($locale, 0, 2);
        
        // Validate locale
        $supportedLocales = ['en', 'pl'];
        if (!in_array($locale, $supportedLocales)) {
            $locale = 'en';
        }
        
        // Set application locale
        App::setLocale($locale);
        
        return $next($request);
    }
}