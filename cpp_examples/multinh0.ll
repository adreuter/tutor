; ModuleID = '../cpp_examples/multinh0.cpp'
source_filename = "../cpp_examples/multinh0.cpp"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-pc-linux-gnu"

%class.C = type { %class.A.base, [4 x i8], %class.B.base, i32 }
%class.A.base = type <{ ptr, i32 }>
%class.B.base = type <{ ptr, i32 }>

$_ZN1CC1Ev = comdat any

$_ZN1CC2Ev = comdat any

$_ZN1AC2Ev = comdat any

$_ZN1BC2Ev = comdat any

@_ZTV1C = external unnamed_addr constant { [3 x ptr], [4 x ptr] }, align 8
@_ZTV1A = external unnamed_addr constant { [3 x ptr] }, align 8
@_ZTV1B = external unnamed_addr constant { [4 x ptr] }, align 8

; Function Attrs: mustprogress noinline norecurse nounwind optnone
define dso_local noundef i32 @main(i32 noundef %argc, ptr noundef %argv) #0 {
entry:
  %retval = alloca i32, align 4
  %argc.addr = alloca i32, align 4
  %argv.addr = alloca ptr, align 8
  %c = alloca %class.C, align 8
  %pb = alloca ptr, align 8
  store i32 0, ptr %retval, align 4
  store i32 %argc, ptr %argc.addr, align 4
  store ptr %argv, ptr %argv.addr, align 8
  call void @_ZN1CC1Ev(ptr noundef nonnull align 8 dereferenceable(32) %c) #2
  %0 = icmp eq ptr %c, null
  br i1 %0, label %cast.end, label %cast.notnull

cast.notnull:                                     ; preds = %entry
  %add.ptr = getelementptr inbounds i8, ptr %c, i64 16
  br label %cast.end

cast.end:                                         ; preds = %cast.notnull, %entry
  %cast.result = phi ptr [ %add.ptr, %cast.notnull ], [ null, %entry ]
  store ptr %cast.result, ptr %pb, align 8
  %1 = load ptr, ptr %pb, align 8
  %vtable = load ptr, ptr %1, align 8
  %vfn = getelementptr inbounds ptr, ptr %vtable, i64 0
  %2 = load ptr, ptr %vfn, align 8
  %call = call noundef i32 %2(ptr noundef nonnull align 8 dereferenceable(12) %1, i32 noundef 42)
  ret i32 0
}

; Function Attrs: noinline nounwind optnone
define linkonce_odr void @_ZN1CC1Ev(ptr noundef nonnull align 8 dereferenceable(32) %this) unnamed_addr #1 comdat align 2 {
entry:
  %this.addr = alloca ptr, align 8
  store ptr %this, ptr %this.addr, align 8
  %this1 = load ptr, ptr %this.addr, align 8
  call void @_ZN1CC2Ev(ptr noundef nonnull align 8 dereferenceable(32) %this1) #2
  ret void
}

; Function Attrs: noinline nounwind optnone
define linkonce_odr void @_ZN1CC2Ev(ptr noundef nonnull align 8 dereferenceable(32) %this) unnamed_addr #1 comdat align 2 {
entry:
  %this.addr = alloca ptr, align 8
  store ptr %this, ptr %this.addr, align 8
  %this1 = load ptr, ptr %this.addr, align 8
  call void @_ZN1AC2Ev(ptr noundef nonnull align 8 dereferenceable(12) %this1) #2
  %0 = getelementptr inbounds i8, ptr %this1, i64 16
  call void @_ZN1BC2Ev(ptr noundef nonnull align 8 dereferenceable(12) %0) #2
  store ptr getelementptr inbounds ({ [3 x ptr], [4 x ptr] }, ptr @_ZTV1C, i32 0, inrange i32 0, i32 2), ptr %this1, align 8
  %add.ptr = getelementptr inbounds i8, ptr %this1, i64 16
  store ptr getelementptr inbounds ({ [3 x ptr], [4 x ptr] }, ptr @_ZTV1C, i32 0, inrange i32 1, i32 2), ptr %add.ptr, align 8
  ret void
}

; Function Attrs: noinline nounwind optnone
define linkonce_odr void @_ZN1AC2Ev(ptr noundef nonnull align 8 dereferenceable(12) %this) unnamed_addr #1 comdat align 2 {
entry:
  %this.addr = alloca ptr, align 8
  store ptr %this, ptr %this.addr, align 8
  %this1 = load ptr, ptr %this.addr, align 8
  store ptr getelementptr inbounds ({ [3 x ptr] }, ptr @_ZTV1A, i32 0, inrange i32 0, i32 2), ptr %this1, align 8
  ret void
}

; Function Attrs: noinline nounwind optnone
define linkonce_odr void @_ZN1BC2Ev(ptr noundef nonnull align 8 dereferenceable(12) %this) unnamed_addr #1 comdat align 2 {
entry:
  %this.addr = alloca ptr, align 8
  store ptr %this, ptr %this.addr, align 8
  %this1 = load ptr, ptr %this.addr, align 8
  store ptr getelementptr inbounds ({ [4 x ptr] }, ptr @_ZTV1B, i32 0, inrange i32 0, i32 2), ptr %this1, align 8
  ret void
}

attributes #0 = { mustprogress noinline norecurse nounwind optnone "frame-pointer"="none" "min-legal-vector-width"="0" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-features"="+cx8,+mmx,+sse,+sse2,+x87" }
attributes #1 = { noinline nounwind optnone "frame-pointer"="none" "min-legal-vector-width"="0" "no-trapping-math"="true" "stack-protector-buffer-size"="8" "target-features"="+cx8,+mmx,+sse,+sse2,+x87" }
attributes #2 = { nounwind }

!llvm.module.flags = !{!0}
!llvm.ident = !{!1}

!0 = !{i32 1, !"wchar_size", i32 4}
!1 = !{!"Debian clang version 15.0.7"}
