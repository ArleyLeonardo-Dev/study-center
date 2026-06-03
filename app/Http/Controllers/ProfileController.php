<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\Models\Career;
use App\Models\Professor;
use App\Models\Subject;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'careers' => Career::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'subjects' => Subject::query()->orderBy('name')->get(['id', 'name', 'career_id']),
            'professors' => Professor::query()->orderBy('name')->get(['id', 'name']),
            'interests' => [
                'subject_ids' => method_exists($user, 'subjects')
                    ? $user->subjects()->pluck('subjects.id')
                    : [],
                'professor_ids' => method_exists($user, 'professors')
                    ? $user->professors()->pluck('professors.id')
                    : [],
            ],
            'publications' => method_exists($user, 'publications')
                ? $user->publications()->latest()->paginate(10)
                : [],
        ]);
    }

    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'career_id' => $validated['career_id'] ?? null,
            'current_semester' => $validated['current_semester'] ?? null,
        ]);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        if (method_exists($user, 'subjects')) {
            $user->subjects()->sync($validated['subject_ids'] ?? []);
        }

        if (method_exists($user, 'professors')) {
            $user->professors()->sync($validated['professor_ids'] ?? []);
        }

        return Redirect::route('profile.edit')->with('success', 'Perfil actualizado correctamente.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
