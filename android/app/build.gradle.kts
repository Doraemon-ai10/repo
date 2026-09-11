plugins { id("com.android.application"); id("org.jetbrains.kotlin.android") }

android {
    namespace = "com.noobie.rblxfinder"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.noobie.rblxfinder"
        minSdk = 23
        targetSdk = 35
        versionCode = 2
        versionName = "2.0.0"
    }

    val releaseStore = rootProject.file("release.keystore")
    if (releaseStore.exists()) {
        signingConfigs {
            create("release") {
                storeFile = releaseStore
                storePassword = "rblxfinder-build"
                keyAlias = "rblxfinder"
                keyPassword = "rblxfinder-build"
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            isShrinkResources = false
            if (releaseStore.exists()) {
                signingConfig = signingConfigs.getByName("release")
            }
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.activity:activity-ktx:1.10.1")
}
