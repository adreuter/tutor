class L { public:
int l; virtual void f(int);
};
class A : public L { public:
int a; void f(int);
};
class B : public L { public:
int b; void f(int);
};
class C : public A , public B { public:
int c;
};
int main(int argc, char **argv) {
    C c;
    L* pl = (B *) &c;
    pl->f(42); // where to dispatch?
    return 0;
}