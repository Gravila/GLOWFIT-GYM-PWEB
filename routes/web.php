<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::view('/tentang', 'tentang');
Route::get('/hitung/{a}/{b}', function ($a, $b) {
    return $a + $b;
});
Route::get('/member', function () {
    return view('member');
});

Route::get('/kelas', function () {
    return view('kelas');
});

Route::get('/kontak', function () {
    return view('kontak');
});