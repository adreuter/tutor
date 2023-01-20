; ModuleID = '../cpp_examples/dupl_base.cpp'
source_filename = "../cpp_examples/dupl_base.cpp"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-pc-linux-gnu"

%class.C = type { %class.A, %class.B, i32, [4 x i8] }
%class.A = type { %class.L.base, i32 }
%class.L.base = type <{ ptr, i32 }>
%class.B = type { %class.L.base, i32 }

$_ZN1CC1Ev = comdat any

$_ZN1CC2Ev = comdat any

$_ZN1AC2Ev = comdat any

$_ZN1BC2Ev = comdat any

$_ZN1LC2Ev = comdat any

$_ZTV1C = comdat any

$_ZTS1C = comdat any

$_ZTI1C = comdat any

@_ZTV1C = linkonce_odr unnamed_addr constant { [3 x ptr], [3 x ptr] } { [3 x ptr] [ptr null, ptr @_ZTI1C, ptr @_ZN1A1fEi], [3 x ptr] [ptr inttoptr (i64 -16 to ptr), ptr @_ZTI1C, ptr @_ZN1B1fEi] }, comdat, align 8
@_ZTVN10__cxxabiv121__vmi_class_type_infoE = external global ptr
@_ZTS1C = linkonce_odr constant [3 x i8] c"1C\00", comdat, align 1
@_ZTI1A = external constant ptr
@_ZTI1B = external constant ptr
@_ZTI1C = linkonce_odr constant { ptr, ptr, i32, i32, ptr, i64, ptr, i64 } { ptr getelementptr inbounds (ptr, ptr @_ZTVN10__cxxabiv121__vmi_class_type_infoE, i64 2), ptr @_ZTS1C, i32 1, i32 2, ptr @_ZTI1A, i64 2, ptr @_ZTI1B, i64 4098 }, comdat, align 8
@_ZTV1A = external unnamed_addr constant { [3 x ptr] }, align 8
@_ZTV1L = external unnamed_addr constant { [3 x ptr] }, align 8
@_ZTV1B = external unnamed_addr constant { [3 x ptr] }, align 8

; Function Attrs: mustprogress noinline norecurse nounwind optnone
define dso_local noundef i32 @main(i32 noundef %argc, ptr noundef %argv) #0 {
entry:
  %retval = alloca i32, align 4
  %argc.addr = alloca i32, align 4
  %argv.addr = alloca ptr, align 8
  %c = alloca %class.C, align 8
  %pl = alloca ptr, align 8
  store i32 0, ptr %retval, align 4
  store i32 %argc, ptr %argc.addr, align 4
  store ptr %argv, ptr %argv.addr, align 8
  call void @_ZN1CC1Ev(ptr noundef nonnull align 8 dereferenceable(36) %c) #3
  %0 = icmp eq ptr %c, null
  br i1 %0, label %cast.end, label %cast.notnull

cast.notnull:                                     ; preds = %entry
  %add.ptr = getelementptr inbounds i8, ptr %c, i64 16
  br label %cast.end

cast.end:                                         ; preds = %cast.notnull, %entry
  %cast.result = phi ptr [ %add.ptr, %cast.notnull ], [ null, %entry ]
  store ptr %cast.result, ptr %pl, align 8
  %1 = load ptr, ptr %pl, align 8
  %vtable = load ptr, ptr %1, align 8
  %vfn = getelementptr inbounds ptr, ptr %vtable, i64 0
  %2 = load ptr, ptr %vfn, align 8
  call void %2(ptr noundef nonnull align 8 dereferenceable(12) %1, i32 noundef 42)
  ret i32 0
}

; Function Attrs: noinline nounwind optnone
define linkonce_odr void @_ZN1CC1Ev(ptr noundef nonnull align 8 dereferenceable(36) %this) unnamed_addr #1 comdat align 2 {
entry:
  %this.addr = alloca ptr, align 8
  store ptr %this, ptr %this.addr, align 8
  %this1 = load ptr, ptr %this.addr, align 8
  call void @_ZN1CC2Ev(ptr noundef nonnull align 8 dereferenceable(36) %this1) #3
  ret void
}

; Function Attrs: noinline nounwind optnone
define linkonce_odr void @_ZN1CC2Ev(ptr noundef nonnull align 8 dereferenceable(36) %this) unnamed_addr #1 comdat align 2 {
entry:
  %this.addr = alloca ptr, align 8
  store ptr %this, ptr %this.addr, align 8
  %this1 = load ptr, ptr %this.addr, align 8
  call void @_ZN1AC2Ev(ptr noundef nonnull align 8 dereferenceable(16) %this1) #3
  %0 = getelementptr inbounds i8, ptr %this1, i64 16
  call void @_ZN1BC2Ev(ptr noundef nonnull align 8 dereferenceable(16) %0) #3
  store ptr getelementptr inbounds ({ [3 x ptr], [3 x ptr] }, ptr @_ZTV1C, i32 0, inrange i32 0, i32 2), ptr %this1, align 8
  %add.ptr = getelementptr inbounds i8, ptr %this1, i64 16
  store ptr getelementptr inbounds ({ [3 x ptr], [3 x ptr] }, ptr @_ZTV1C, i32 0, inrange i32 1, i32 2), ptr %add.ptr, align 8
  ret void
}

; Function Attrs: noinline nounwind optnone
define linkonce_odr void @_ZN1AC2Ev(ptr noundef nonnull align 8 dereferenceable(16) %this) unnamed_addr #1 comdat align 2 {
entry:
  %this.addr = alloca ptr, align 8
  store ptr %this, ptr %this.addr, align 8
  %this1 = load ptr, ptr %this.addr, align 8
  call void @_ZN1LC2Ev(ptr noundef nonnull align 8 dereferenceable(12) %this1) #3
  store ptr getelementptr inbounds ({ [3 x ptr] }, ptr @_ZTV1A, i32 0, inrange i32 0, i32 2), ptr %this1, align 8
  ret void
}

; Function Attrs: noinline nounwind optnone
define linkonce_odr void @_ZN1BC2Ev(ptr noundef nonnull align 8 dereferenceable(16) %this) unnamed_addr #1 comdat align 2 {
entry:
  %this.addr = alloca ptr, align 8
  store ptr %this, ptr %this.addr, align 8
  %this1 = load ptr, ptr %this.addr, align 8
  call void @_ZN1LC2Ev(ptr noundef nonnull align 8 dereferenceable(12) %this1) #3
  store ptr getelementptr inbounds ({ [3 x ptr] }, ptr @_ZTV1B, i32 0, inrange i32 0, i32 2), ptr %this1, align 8
  ret void
}

declare void @_ZN1A1fEi(ptr noundef nonnull align 8 dereferenceable(16), i32 noundef) unnamed_addr #2

declare void @_ZN1B1fEi(ptr noundef nonnull align 8 dereferenceable(16), i32 noundef) unnamed_addr #2

; Function Attrs: noinline nounwind optnone
define linkonce_odr void @_ZN1LC2Ev(ptr noundef nonnull align 8 dereferenceable(12) %this) unnamed_addr #1 comdat align 2 {
entry:
  %this.addr = alloca ptr, align 8
  store ptr %this, ptr %this.addr, align 8
  %this1 = load ptr, ptr %this.addr, align 8
  store ptr getelementptr inbounds ({ [3 x ptr] }, ptr @_ZTV1L, i32 0, inrange i32 0, i32 2), ptr %this1, align 8
  ret void
}

attributes #0 = { mustprogress noinline norecurse nounwind optnone "frame-pointer"="none" "min-legal-vector-width"="0" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-features"="+cx8,+mmx,+sse,+sse2,+x87" }
attributes #1 = { noinline nounwind optnone "frame-pointer"="none" "min-legal-vector-width"="0" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-features"="+cx8,+mmx,+sse,+sse2,+x87" }
attributes #2 = { "frame-pointer"="none" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-features"="+cx8,+mmx,+sse,+sse2,+x87" }
attributes #3 = { nounwind }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 1, !"wchar_size", i32 4}
!1 = !{!"Debian clang version 15.0.7"}
